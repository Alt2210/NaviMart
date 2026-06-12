import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type TimelyAuthResponse = {
  success?: boolean;
  data?: { access_token?: string };
};

type TimelyCompletionResponse = {
  type?: string;
  message?: string;
  error?: unknown;
};

/**
 * Minimal client for the TimelyGPT chat API (see request.py at repo root):
 * - GET  {base}/sdk-auth/authenticate  with X-Timely-API     -> access token (~55 min)
 * - POST {base}/llm-completion         with Bearer token     -> { type: 'final_response', message }
 */
@Injectable()
export class TimelyService {
  private readonly logger = new Logger(TimelyService.name);
  private accessToken: string | null = null;
  private tokenExpiresAt = 0;

  constructor(private readonly configService: ConfigService) {}

  get isConfigured(): boolean {
    return !!this.apiKey;
  }

  private get apiKey(): string | undefined {
    return (
      this.configService.get<string>('TIMELY_API_KEY') ??
      process.env.TIMELY_API_KEY
    );
  }

  private get baseUrl(): string {
    return (
      this.configService.get<string>('TIMELY_BASE_URL') ??
      process.env.TIMELY_BASE_URL ??
      'https://hello.timelygpt.co.kr/api/v2/chat'
    );
  }

  private get model(): string {
    return (
      this.configService.get<string>('TIMELY_MODEL') ??
      process.env.TIMELY_MODEL ??
      'gpt-4o-mini'
    );
  }

  private async ensureAuth(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiresAt) {
      return this.accessToken;
    }

    if (!this.apiKey) {
      throw new ServiceUnavailableException(
        'AI Chef is not configured (missing TIMELY_API_KEY)',
      );
    }

    const response = await fetch(`${this.baseUrl}/sdk-auth/authenticate`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Timely-API': this.apiKey,
      },
    });

    if (!response.ok) {
      this.logger.error(`Timely auth failed: HTTP ${response.status}`);
      throw new ServiceUnavailableException('AI Chef authentication failed');
    }

    const data = (await response.json()) as TimelyAuthResponse;
    const token = data.data?.access_token;

    if (!data.success || !token) {
      this.logger.error(`Timely auth rejected: ${JSON.stringify(data)}`);
      throw new ServiceUnavailableException('AI Chef authentication failed');
    }

    this.accessToken = token;
    this.tokenExpiresAt = Date.now() + 55 * 60 * 1000;
    return token;
  }

  async complete(sessionId: string, prompt: string): Promise<string> {
    let token = await this.ensureAuth();

    for (let attempt = 0; attempt < 2; attempt += 1) {
      const response = await fetch(`${this.baseUrl}/llm-completion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          session_id: sessionId,
          messages: [{ role: 'user', content: prompt }],
          chat_model_node: { model: this.model },
          chat_type: 'DYNAMIC_CHAT',
          stream: false,
          locale: 'vi',
        }),
      });

      if (response.status === 401 && attempt === 0) {
        this.accessToken = null;
        token = await this.ensureAuth();
        continue;
      }

      if (!response.ok) {
        const text = await response.text();
        this.logger.error(`Timely completion failed ${response.status}: ${text}`);
        throw new ServiceUnavailableException('AI Chef is temporarily unavailable');
      }

      const data = (await response.json()) as TimelyCompletionResponse;

      if (data.type === 'final_response' && typeof data.message === 'string') {
        return data.message;
      }

      this.logger.error(`Timely unexpected response: ${JSON.stringify(data)}`);
      throw new ServiceUnavailableException('AI Chef returned an unexpected response');
    }

    throw new ServiceUnavailableException('AI Chef is temporarily unavailable');
  }
}
