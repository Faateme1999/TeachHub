import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';

import { I18nService } from 'nestjs-i18n';

@Injectable()
export class EmailService {
  private readonly gmail;

  constructor(private readonly configService: ConfigService,
    private readonly i18n: I18nService,
  ) {
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

      const greeting = await this.i18n.translate(
        'common.passwordReset.greeting',
        {
          args: { name },
        },
      );


      const requestText = await this.i18n.translate(
        'common.passwordReset.request',
      );


      const instruction = await this.i18n.translate(
        'common.passwordReset.instruction',
      );



      const resetPassword = await this.i18n.translate(
        'common.passwordReset.resetPassword',
      );



      const expires = await this.i18n.translate(
        'common.passwordReset.expires',
      );


      const ignore = await this.i18n.translate(
        'common.passwordReset.ignore',
      );



      const html = `
        <h2>${greeting}</h2>

          <p>
             ${requestText}
          </p>

        <p>
           ${instruction}
        </p>

        <p>
           <a href="${resetLink}">
            ${resetPassword}
           </a>
        </p>

        <p>
          ${expires}
        </p>

        <p>
          ${ignore}
        </p>
      `;


      const subject = await this.i18n.translate(
        'common.passwordReset.subject',
      );


      const message = [
        `From: TeachHub <${from}>`,
        `To: ${email}`,
        `Subject: ${subject}`,
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
        await this.i18n.translate('common.passwordReset.sendFailed'),
      );
    }
  }
}
