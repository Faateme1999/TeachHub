import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';
import { GeneratedMissionsResponseDto } from './dto/generated-mission.dto';

@Injectable()
export class AiService {
  private readonly groq: Groq;

  constructor(private readonly configService: ConfigService) {
    const key = this.configService.get<string>('GROQ_API_KEY');

    this.groq = new Groq({
      apiKey: key,
    });
  }

  async generateMissions(
    learningOutcome: string,
  ): Promise<GeneratedMissionsResponseDto> {
    console.log('CALLING GROQ');

    const response = await this.groq.chat.completions.create({
      model: 'openai/gpt-oss-20b',
      max_tokens: 4000,

      messages: [
        {
          role: 'system',
          content: `
You are an educational quiz generator.

Your task is to create quiz missions based on a learning outcome.

Rules:
- Return ONLY valid JSON.
- No markdown.
- No explanations.
- Generate 2 missions per learning outcome.
- The mission must contain 5 questions.
- Generate a passingScore for each mission.
- Generate a maxAttempts for each mission.
- Each question must have 4 options.
- Questions can be SINGLE_CHOICE or MULTIPLE_CHOICE.
- SINGLE_CHOICE means exactly one option has isCorrect=true.
- MULTIPLE_CHOICE means two or more options can have isCorrect=true.
- isCorrect must always be boolean.
- type must be exactly "SINGLE_CHOICE" or "MULTIPLE_CHOICE".

Return this structure:

{
  "missions": [
    {
      "title": "string",
      "passingScore": 70,
      "maxAttempts": 3,
      "questions": [
        {
          "text": "string",
          "type": "SINGLE_CHOICE",
          "options": [
            {
              "text": "string",
              "isCorrect": true
            }
          ]
        }
      ]
    }
  ]
}
`,
        },
        {
          role: 'user',
          content: learningOutcome,
        },
      ],
    });

    const content = response.choices[0].message.content;

    console.log('GROQ RESPONSE:', JSON.stringify(response, null, 2));

    if (!content) {
      throw new Error('AI returned empty response');
    }
    return JSON.parse(content);
  }
}
