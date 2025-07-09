import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { RazorpayService } from 'src/payment/razorpay/razorpay.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, PrismaService, RazorpayService],
})
export class OrdersModule {}
