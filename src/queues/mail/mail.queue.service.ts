import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { SEND_PASSWORD_RESET_EMAIL, SEND_PASSWORD_RESET_SUCCESS_EMAIL, SEND_WELCOME_EMAIL } from './constants';

@Injectable()
export class MailQueueService {

  constructor(@InjectQueue('email') private readonly mailQueue: Queue) {
    
  }

  onModuleInit() {
    const redisClient = this.mailQueue.client;

    redisClient.on('connect', () => {
      console.log('✅ Redis (Bull) connected');
    });

    redisClient.on('ready', () => {
      console.log('⚡ Redis (Bull) ready to accept jobs');
    });

    redisClient.on('error', (err) => {
      console.error('❌ Redis (Bull) error:', err);
    });

    redisClient.on('end', () => {
      console.warn('⚠️ Redis (Bull) connection closed');
    });
  }

  async sendRegisterationSuccessEmail(to: string, name: string) {
    await this.mailQueue.add(SEND_WELCOME_EMAIL, 
      {
        to,
        name
      }
    );
  }

  async sendResetPasswordEmail(to: string, name: string, resetLink: string) {
    await this.mailQueue.add(SEND_PASSWORD_RESET_EMAIL,
      {
        to, 
        name, 
        resetLink
      }
    );
  }

  async sendPasswordResetSuccessEmail(to: string, name: string) {
    await this.mailQueue.add(SEND_PASSWORD_RESET_SUCCESS_EMAIL, 
      {
        to, 
        name
      }
    );
  }
}
