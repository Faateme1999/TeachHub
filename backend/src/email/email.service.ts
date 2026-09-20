import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly resend: Resend;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');

    this.resend = new Resend(apiKey);
  }

  async sendPasswordResetEmail(email: string, name: string, resetLink: string) {
    try {
      await this.resend.emails.send({
        from: 'TeachHub <onboarding@resend.dev>',
        to: email,
        subject: 'Reset your TeachHub password',
        html: `
          <h2>Reset your password</h2>

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
    } catch (error) {
      console.error('Failed to send password reset email:', error);

      throw new InternalServerErrorException(
        'Failed to send password reset email',
      );
    }
  }
}
