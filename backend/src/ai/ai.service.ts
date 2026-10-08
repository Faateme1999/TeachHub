import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';
import { GenerateDiagnosticTestInputDto } from './dto/missions/diagnostic-test/generate-diagnostic-test-input.dto';
import { GeneratedDiagnosticTestOutputDto } from './dto/missions/diagnostic-test/generated-diagnostic-test-output.dto';
import { GenerateWeaknessInputDto } from './dto/missions/weakness/generate-weakness-input.dto';
import { GeneratedWeaknessOutputDto } from './dto/missions/weakness/generated-weakness-output.dto';
import { GenerateLessonReviewInputDto } from './dto/missions/review/generate-lesson-review-input.dto';
import { GeneratedLessonReviewOutputDto } from './dto/missions/review/generated-lesson-review-output.dto';

@Injectable()
export class AiService {
  private readonly groq: Groq;

  constructor(private readonly configService: ConfigService) {
    const key = this.configService.get<string>('GROQ_API_KEY');

    this.groq = new Groq({
      apiKey: key,
    });
  }

  async generateLessonReview(
    dto: GenerateLessonReviewInputDto,
  ): Promise<GeneratedLessonReviewOutputDto> {
    const response = await this.groq.chat.completions.create({
      model: 'openai/gpt-oss-20b',
      max_tokens: 4000,

      messages: [
        {
          role: 'system',
          content: `
You are an educational content reviewer.

Return ONLY valid JSON.

Create a review of the lesson using the lesson content and learning outcomes.

Return exactly:

{
  "concepts": [
    {
      "title": "string",
      "explanation": "string",
      "examples": [
        {
          "type": "code",
          "content": "string"
        }
      ],
      "keyTakeaway": "string"
    }
  ]
}

The example type must be "code", "analogy", or "real_world".
`,
        },
        {
          role: 'user',
          content: JSON.stringify(dto),
        },
      ],
    });

    const content = response.choices[0].message.content;

    if (!content) {
      throw new Error('AI returned empty response');
    }

    return JSON.parse(content);
  }

  async generateDiagnosticTest(
    dto: GenerateDiagnosticTestInputDto,
  ): Promise<GeneratedDiagnosticTestOutputDto> {
    const response = await this.groq.chat.completions.create({
      model: 'openai/gpt-oss-20b',
      max_tokens: 4000,

      messages: [
        {
          role: 'system',
          content: `You are an educational diagnostic test generator.

Your task is to create exactly 5 diagnostic questions based on the provided learning outcomes.

Return ONLY valid JSON.
No markdown.
No explanations outside JSON.

Rules:

- Generate exactly 5 questions.
- Use ONLY the provided learning outcomes.
- Every question must be related to exactly one learning outcome.
- Every question must include the ID of the learning outcome it evaluates.
- The learningOutcomeId must be copied exactly from the provided learning outcomes.
- Do not invent learning outcome IDs.
- Each question must include a specific topic related to that learning outcome.
- The topic must be a smaller concept or skill within the learning outcome.
- Question types can only be "SINGLE_CHOICE" or "MULTIPLE_CHOICE".
- Each question must have exactly 4 options.
- Every option must have "text" and "isCorrect".
- "isCorrect" must always be a boolean.
- SINGLE_CHOICE must have exactly one correct option.
- MULTIPLE_CHOICE must have at least two correct options.
- Questions should test understanding, not simple memorization when possible.
- Do not create questions unrelated to the learning outcomes.
- Do not invent learning outcomes.
- Do not repeat the same question.

Return exactly this JSON structure:

{
  "questions": [
    {
      "question": "string",
      "type": "SINGLE_CHOICE",
      "options": [
        {
          "text": "string",
          "isCorrect": true
        },
        {
          "text": "string",
          "isCorrect": false
        },
        {
          "text": "string",
          "isCorrect": false
        },
        {
          "text": "string",
          "isCorrect": false
        }
      ],
      "learningOutcomeId": 1,
      "topic": "string"
    }
  ]
}`,
        },
        { role: 'user', content: JSON.stringify(dto) },
      ],
    });

    const content = response.choices[0].message.content;

    if (!content) {
      throw new Error('AI returned empty response');
    }

    return JSON.parse(content);
  }

  async generateWeaknessRemediation(
    dto: GenerateWeaknessInputDto,
  ): Promise<GeneratedWeaknessOutputDto> {
    const response = await this.groq.chat.completions.create({
      model: 'openai/gpt-oss-20b',
      max_tokens: 4000,

      messages: [
        {
          role: 'system',
          content: `You are an educational remediation assistant.

Your task is to help a student understand and correct their mistakes.

Return ONLY valid JSON.
No markdown.
No explanations outside JSON.

Rules:

- The learning outcome is the main learning context.
- The topic is the specific area where the student has weakness.
- Explain why the student's selected answer was wrong for each question.
- Use the provided correct answers as the source of truth.
- Do not change or invent correct answers.
- Do not invent question IDs.
- Never mention question IDs, option IDs, option numbers, or database IDs.
- Never write phrases such as "Option 1", "Option 8", or "Question 1".
- Refer naturally to the student's answer and the correct answer.
- Teach the topic clearly and simply in the context of the learning outcome.
- Provide one simple example.
- Provide one short takeaway.

Field requirements:

- "explanations": one explanation for each wrong question.
- Each explanation must use the questionId provided in the input.
- The questionId is only for internal matching and must never appear inside the explanation text.
- Keep each explanation under 2 sentences.

- "teaching.explanation": a clear and simple explanation of the topic.
- Keep the teaching explanation under 2 sentences.

- "teaching.example": one simple example.
- Keep it short.

- "teaching.takeaway": one short key point.
- Keep it to one sentence.

Return exactly this JSON structure:

{
  "explanations": [
    {
      "questionId": 1,
      "explanation": "string"
    }
  ],
  "teaching": {
    "explanation": "string",
    "example": "string",
    "takeaway": "string"
  }
}`,
        },
        {
          role: 'user',
          content: JSON.stringify(dto),
        },
      ],
    });
    const content = response.choices[0].message.content;

    if (!content) {
      throw new Error('AI returned empty response');
    }

    return JSON.parse(content);
  }
}
