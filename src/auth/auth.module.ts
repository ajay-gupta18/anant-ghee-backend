import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommonModule } from 'src/common/common.module';
import { MailerService } from 'src/mailer/mailer.service';
import { MailQueueModule } from 'src/queues/mail/mail.queue.module';
import { MailQueueService } from 'src/queues/mail/mail.queue.service';


@Module({
  imports:[
    CommonModule,
    MailQueueModule
  ],
  controllers:[AuthController],
  providers:[
    AuthService, 
    PrismaService,
    MailQueueService
  ]
})
export class AuthModule {}
