import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly transporter: nodemailer.Transporter;

  // Nodemailer: a library for sending emails from our app. It handles the SMTP  (the rules for sending emails).
  // Transporter: an object created by Nodemailer. It handles the connection between our app and the email server and is responsible for sending emails.

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASSWORD'),
      },
    });
    this.transporter.verify((error, success) => {
      if (error) {
        console.log('SMTP VERIFY ERROR:', error);
      } else {
        console.log('SMTP READY:', success);
      }
    });
  }

  async sendPasswordResetEmail(email: string, name: string, resetLink: string) {
    try {
      const info = await this.transporter.sendMail({
        from: `"TeachHub" <${this.configService.get<string>('MAIL_USER')}>`,
        to: email,
        subject: 'Reset your TeachHub password',
        html: `
          <h2>Hello ${name}</h2>

          <p>
            We received a request to reset your TeachHub password.
          </p>

          <p>
            Click the link below to reset your password:
          </p>

          <p>
            <a href="${resetLink}">
              Reset Password
            </a>
          </p>

          <p>
            This link will expire in 15 minutes.
          </p>

          <p>
            If you did not request a password reset, you can ignore this email.
          </p>
        `,
      });
      console.log('EMAIL SENT:', {
        messageId: info.messageId,
        accepted: info.accepted,
        rejected: info.rejected,
        response: info.response,
      });
    } catch (error) {
      console.error('Failed to send password reset email:', error);

      throw new InternalServerErrorException(
        'Failed to send password reset email',
      );
    }
  }
}
