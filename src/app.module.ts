import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CommonService } from './common/common.service';
import { CommonModule } from './common/common.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { CartModule } from './modules/cart/cart.module';
import { OrdersModule } from './modules/orders/orders.module';
import { MailerService } from './mailer/mailer.service';
import { BullModule } from '@nestjs/bull';
import { MailQueueModule } from './queues/mail/mail.queue.module';
import { RazorpayService } from './payment/razorpay/razorpay.service';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    CommonModule,
    UsersModule,
    ProductsModule,
    CartModule,
    OrdersModule,
    MailQueueModule,
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        // password: process.env.REDIS_PASSWORD
      }
    })
  ],
  controllers: [AppController],
  providers: [AppService, CommonService, MailerService, RazorpayService],
})
export class AppModule {}
