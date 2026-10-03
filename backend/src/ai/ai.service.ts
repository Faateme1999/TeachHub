import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';
import { GenerateLessonReviewInputDto } from './dto/generate-lesson-review-input.dto';
import { GeneratedLessonReviewOutputDto } from './dto/generated-lesson-review-output.dto';
import { GenerateDiagnosticTestInputDto } from './dto/generate-diagnostic-test-input.dto';
import { GeneratedDiagnosticTestOutputDto } from './dto/generated-diagnostic-test-output.dto';

@Injectable()
export class AiService {
  private readonly groq: Groq;

  constructor(private readonly configService: ConfigService) {
    const key = this.configService.get<string>('GROQ_API_KEY');

    this.groq = new Groq({
      apiKey: key,
    });
  }

  //   async generateMissions(
  //     learningOutcome: string,
  //   ): Promise<GeneratedMissionsResponseDto> {
  //     console.log('CALLING GROQ');

  //     const response = await this.groq.chat.completions.create({
  //       model: 'openai/gpt-oss-20b',
  //       max_tokens: 4000,

  //       messages: [
  //         {
  //           role: 'system',
  //           content: `
  // You are an educational quiz generator.

  // Your task is to create quiz missions based on a learning outcome.

  // Rules:
  // - Return ONLY valid JSON.
  // - No markdown.
  // - No explanations.
  // - Generate 2 missions per learning outcome.
  // - The mission must contain 5 questions.
  // - Generate a passingScore for each mission.
  // - Generate a maxAttempts for each mission.
  // - Each question must have 4 options.
  // - Questions can be SINGLE_CHOICE or MULTIPLE_CHOICE.
  // - SINGLE_CHOICE means exactly one option has isCorrect=true.
  // - MULTIPLE_CHOICE means two or more options can have isCorrect=true.
  // - isCorrect must always be boolean.
  // - type must be exactly "SINGLE_CHOICE" or "MULTIPLE_CHOICE".

  // Return this structure:

  // {
  //   "missions": [
  //     {
  //       "title": "string",
  //       "passingScore": 70,
  //       "maxAttempts": 3,
  //       "questions": [
  //         {
  //           "text": "string",
  //           "type": "SINGLE_CHOICE",
  //           "options": [
  //             {
  //               "text": "string",
  //               "isCorrect": true
  //             }
  //           ]
  //         }
  //       ]
  //     }
  //   ]
  // }
  // `,
  //         },
  //         {
  //           role: 'user',
  //           content: learningOutcome,
  //         },
  //       ],
  //     });

  //     const content = response.choices[0].message.content;

  //     console.log('GROQ RESPONSE:', JSON.stringify(response, null, 2));

  //     if (!content) {
  //       throw new Error('AI returned empty response');
  //     }
  //     return JSON.parse(content);
  //   }

  //   async generateLessonReview(
  //     dto: GenerateLessonReviewInputDto,
  //   ): Promise<GeneratedLessonReviewOutputDto> {
  //     const response = await this.groq.chat.completions.create({
  //       model: 'openai/gpt-oss-20b',
  //       max_tokens: 4000,

  //       messages: [
  //         {
  //           role: 'system',
  //           content: `
  // You are an educational content reviewer.

  // Your task is to create a short, clear and useful review of a lesson.

  // The review must help a student understand and remember the most important concepts
  // needed to achieve the lesson's learning outcomes.

  // Rules:
  // - Return ONLY valid JSON.
  // - No markdown outside JSON.
  // - Do not create quiz questions.
  // - Do not test the student.
  // - Do not assign scores.
  // - Do not teach topics that are unrelated to the lesson.
  // - Use the lesson content and learning outcomes as the source.
  // - Identify the most important concepts from the lesson.
  // - Do not create a separate concept for every learning outcome.
  // - If multiple learning outcomes are related to the same concept, combine them.
  // - Avoid duplicate concepts.
  // - Create between 3 and 7 concepts depending on the lesson.
  // - Each concept explanation must be only 2 or 3 sentences.
  // - Each concept must have between 1 and 3 useful examples.
  // - An example can be:
  //   - a short code example,
  //   - a real-world example,
  //   - or an analogy.
  // - Examples should only be included when they genuinely help understanding.
  // - Each concept must have exactly one or two key takeaways.
  // - The key takeaway must be one or two short sentences.
  // - Do not simply copy the lesson text.
  // - Rewrite the concepts in clear student-friendly language.

  // Return exactly this JSON structure:

  // {
  //   "concepts": [
  //     {
  //       "title": "string",
  //       "explanation": "string",
  //       "examples": [
  //         {
  //           "type": "code",
  //           "content": "string"
  //         }
  //       ],
  //       "keyTakeaway": "string"
  //     }
  //   ]
  // }

  // The value of "type" must be exactly one of:
  // "code", "analogy", "real_world".
  // `,
  //         },
  //         {
  //           role: 'user',
  //           content: JSON.stringify(dto),
  //         },
  //       ],
  //     });

  //     const content = response.choices[0].message.content;
  //     console.log('GROQ REVIEW RESPONSE:', JSON.stringify(response, null, 2));
  //     if (!content) {
  //       throw new Error('AI returned empty response');
  //     }

  //     return JSON.parse(content);
  //   }

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

  async generateDiagnosticQuestions(
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
}
