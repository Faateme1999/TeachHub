import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';

@Injectable()
export class EmailService {
  private readonly gmail;

  constructor(private readonly configService: ConfigService) {
    const oauth2Client = new google.auth.OAuth2(
      this.configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      this.configService.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
    );

    oauth2Client.setCredentials({
      refresh_token: this.configService.getOrThrow<string>(
        'GMAIL_REFRESH_TOKEN',
      ),
    });

    this.gmail = google.gmail({
      version: 'v1',
      auth: oauth2Client,
    });
  }

  async sendPasswordResetEmail(email: string, name: string, resetLink: string) {
    try {
      const from = this.configService.getOrThrow<string>('MAIL_USER');

      const html = `
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
      `;

      const message = [
        `From: TeachHub <${from}>`,
        `To: ${email}`,
        'Subject: Reset your TeachHub password',
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
        '',
        html,
      ].join('\r\n');

      const raw = Buffer.from(message, 'utf8').toString('base64url');

      const result = await this.gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw,
        },
      });

      console.log('EMAIL SENT:', {
        messageId: result.data.id,
        threadId: result.data.threadId,
        to: email,
      });
    } catch (error) {
      console.error('Failed to send password reset email:', error);

      throw new InternalServerErrorException(
        'Failed to send password reset email',
      );
    }
  }
}
