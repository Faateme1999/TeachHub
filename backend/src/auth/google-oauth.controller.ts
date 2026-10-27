import { Controller, Get, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { google } from 'googleapis';
import { ConfigService } from '@nestjs/config';

@Controller('auth/google')
export class GoogleOAuthController {
  private readonly oauth2Client;

  constructor(private readonly configService: ConfigService) {
    this.oauth2Client = new google.auth.OAuth2(
      this.configService.get<string>('GOOGLE_CLIENT_ID'),
      this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
      this.configService.get<string>('GOOGLE_REDIRECT_URI'),
    );
  }

  @Get()
  authorize(@Res() res: Response) {
    const authUrl = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: ['https://www.googleapis.com/auth/gmail.send'],
    });

    return res.redirect(authUrl);
  }

  @Get('callback')
  async callback(@Query('code') code: string, @Res() res: Response) {
    if (!code) {
      return res.status(400).send('Authorization code is missing.');
    }

    try {
      const { tokens } = await this.oauth2Client.getToken(code);

      console.log('GOOGLE OAUTH TOKENS:');
      console.log(tokens);

      return res.send(`
        <h1>Google OAuth successful!</h1>
        <p>Check your Render logs for the refresh token.</p>
      `);
    } catch (error) {
      console.error('GOOGLE OAUTH ERROR:', error);

      return res.status(500).send('Failed to exchange authorization code.');
    }
  }
}
