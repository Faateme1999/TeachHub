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
          content: `
You are an AI assistant for an online learning platform.

Based on this learning outcome:
"Student can implement JWT authentication in NestJS"

Generate 3 practical coding missions for the student.

Return only JSON format:
{
  "missions": [
    {
      "title": "",
      "description": "",
      "difficulty": ""
    }
  ]
}
`,
        },
      ],
    });

    return response.choices[0].message.content;
  }

  async getModels() {
    return await this.groq.models.list();
  }
}
