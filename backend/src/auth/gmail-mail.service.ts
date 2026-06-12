import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type GoogleTokenResponse = {
  access_token?: string;
  expires_in?: number;
  error?: string;
  error_description?: string;
};

@Injectable()
export class GmailMailService {
  private accessToken?: string;
  private accessTokenExpiresAt = 0;

  constructor(private readonly configService: ConfigService) {}

  isEnabled() {
    return this.configService.get<string>('PASSWORD_RESET_MAIL_MODE') === 'gmail-api';
  }

  async sendPasswordResetCode(to: string, code: string) {
    await this.sendMail({
      to,
      subject: 'NaviMart password reset code',
      text: [
        'Your NaviMart password reset code is:',
        '',
        code,
        '',
        'This code expires in 60 minutes.',
        'If you did not request a password reset, you can ignore this email.',
      ].join('\n'),
    });
  }

  async sendEmailVerificationCode(to: string, code: string) {
    await this.sendMail({
      to,
      subject: 'NaviMart email verification code',
      text: [
        'Your NaviMart email verification code is:',
        '',
        code,
        '',
        'Enter this code in NaviMart to verify your email address.',
      ].join('\n'),
    });
  }

  private async sendMail(input: { to: string; subject: string; text: string }) {
    this.ensureConfigured();

    const accessToken = await this.getAccessToken();
    const fromEmail = this.configService.getOrThrow<string>('GMAIL_FROM_EMAIL');
    const raw = this.toBase64Url(
      [
        `From: NaviMart <${fromEmail}>`,
        `To: ${input.to}`,
        `Subject: ${input.subject}`,
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 7bit',
        '',
        input.text,
      ].join('\r\n'),
    );

    const response = await fetch(
      'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ raw }),
      },
    );

    if (!response.ok) {
      throw new InternalServerErrorException(
        `Gmail API send failed: ${await this.readError(response)}`,
      );
    }
  }

  private async getAccessToken() {
    if (this.accessToken && Date.now() < this.accessTokenExpiresAt) {
      return this.accessToken;
    }

    const body = new URLSearchParams({
      client_id: this.configService.getOrThrow<string>('GMAIL_CLIENT_ID'),
      client_secret: this.configService.getOrThrow<string>('GMAIL_CLIENT_SECRET'),
      refresh_token: this.configService.getOrThrow<string>('GMAIL_REFRESH_TOKEN'),
      grant_type: 'refresh_token',
    });

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    const data = (await response.json().catch(() => ({}))) as GoogleTokenResponse;

    if (!response.ok || !data.access_token) {
      const message =
        data.error_description ?? data.error ?? `HTTP ${response.status}`;
      throw new InternalServerErrorException(
        `Gmail OAuth token request failed: ${message}`,
      );
    }

    this.accessToken = data.access_token;
    this.accessTokenExpiresAt =
      Date.now() + Math.max(60, (data.expires_in ?? 3600) - 60) * 1000;

    return this.accessToken;
  }

  private ensureConfigured() {
    const missing = [
      'GMAIL_FROM_EMAIL',
      'GMAIL_CLIENT_ID',
      'GMAIL_CLIENT_SECRET',
      'GMAIL_REFRESH_TOKEN',
    ].filter((key) => !this.configService.get<string>(key));

    if (missing.length > 0) {
      throw new InternalServerErrorException(
        `Gmail API mail is not configured. Missing: ${missing.join(', ')}`,
      );
    }
  }

  private toBase64Url(value: string) {
    return Buffer.from(value, 'utf8')
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/g, '');
  }

  private async readError(response: Response) {
    const body = await response.text().catch(() => '');
    return body || `HTTP ${response.status}`;
  }
}
