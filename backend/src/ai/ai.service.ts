import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';

@Injectable()
export class AiService {
  private readonly groq: Groq;

  constructor(private readonly configService: ConfigService) {
    const key = this.configService.get<string>('GROQ_API_KEY');

    console.log('GROQ KEY EXISTS:', !!key);

    this.groq = new Groq({
      apiKey: key,
    });
  }

  async generatMissions(learningOutcome: string) {
    console.log('CALLING GROQ');

    const response = await this.groq.chat.completions.create({
      model: 'openai/gpt-oss-20b',
      messages: [
        {
          role: 'user',
          content: 'Say hello',
        },
      ],
    });

    return response.choices[0].message.content;
  }

  async getModels() {
    return await this.groq.models.list();
  }
}
