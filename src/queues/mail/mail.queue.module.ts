import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MailerService } from 'src/mailer/mailer.service';
import { MailProcessor } from './mail.processor';
import { MailQueueService } from './mail.queue.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email',
      defaultJobOptions: {
        removeOnComplete: 10, 
        removeOnFail: false,  
        attempts: 3, // Retry up to 3 times
        backoff: {
          type: 'exponential', // Exponential backoff for retries (increase delay after each failure)
          delay: 5000, // Initial retry delay in ms (5 seconds)
    },  
      }
    })
  ],
  providers: [
    MailerService,
    MailProcessor,
    MailQueueService
  ],
  exports: [
    BullModule
  ]
})
export class MailQueueModule {}
