import { Injectable } from '@nestjs/common';
import getRegistrationEmailTemplate from './templates/registration-success.template';
import getPasswordResetEmailTemplate from './templates/password-reset.template';
import getPasswordResetSuccessEmailTemplate from './templates/password-reset-success.template';
const nodemailer = require('nodemailer');

@Injectable()
export class MailerService {
  private readonly transporter;
  private readonly companyName = 'Anant Ghee';
  private readonly logoLink = '';
  private readonly supportMailId = '';
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: true,
      auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.SMTP_MAIL_KEY
      }
    });
  }

  private async sendEmail(to: string, subject: string, html: string) {
    const mailOptions = {
      from: `Anant Ghee <${process.env.MAILER_EMAIL}>`,
      to,
      subject,
      html
    }

    await this.transporter.sendMail(mailOptions);
  }

  async sendRegistrationSuccessEmail(to: string, name: string) {
    const htmlTemplate = getRegistrationEmailTemplate(name, '');
    const subject = `🎉 Welcome to Anant Ghee, ${name}! Your account is ready.`;

    await this.sendEmail(to, subject, htmlTemplate);
  }

  async sendResetPasswordEmail(to: string, name: string, resetLink: string) {
    const htmlTemplate = getPasswordResetEmailTemplate(name, resetLink, this.logoLink, this.supportMailId);
    const subject = 'Forgot Your Password? Let’s Fix That.'

    await this.sendEmail(to, subject, htmlTemplate);
  }

  async sendPasswordResetSuccessEmail(to: string, name: string) {
    const htmlTemplate = getPasswordResetSuccessEmailTemplate(name, this.companyName, this.logoLink, this.supportMailId);
    const subject = 'Your Password Has Been Successfully Reset.'

    await this.sendEmail(to, subject, htmlTemplate);
  }
}
