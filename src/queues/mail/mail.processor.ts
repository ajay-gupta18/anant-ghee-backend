import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { MailerService } from "src/mailer/mailer.service";
import { SEND_PASSWORD_RESET_EMAIL, SEND_PASSWORD_RESET_SUCCESS_EMAIL, SEND_WELCOME_EMAIL } from './constants';
@Processor('email')
export class MailProcessor  {

  constructor(private readonly mailerService: MailerService) { }

  @Process(SEND_WELCOME_EMAIL)
  async sendRegistrationSuccessEmail(job: Job) {
    const { to, name } = job.data;
    await this.mailerService.sendRegistrationSuccessEmail(to, name);
  }

  @Process(SEND_PASSWORD_RESET_EMAIL)
  async sendResetPasswordEmail(job: Job) {
    const { to, name, resetLink } = job.data;
    await this.mailerService.sendResetPasswordEmail(to, name, resetLink);
  }

  @Process(SEND_PASSWORD_RESET_SUCCESS_EMAIL)
  async sendPasswordResetSuccessEmail(job: Job) {
    const { to, name } = job.data;
    await this.mailerService.sendPasswordResetSuccessEmail(to, name);
  }
}