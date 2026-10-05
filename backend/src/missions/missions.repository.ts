import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GeneratedDiagnosticTestOutputDto } from 'src/ai/dto/generated-diagnostic-test-output.dto';
import { text } from 'stream/consumers';

@Injectable()
export class MissionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async saveReview(lessonId: number, content: object) {
    return this.prisma.missionReview.upsert({
      where: {
        lessonId,
      },
      create: {
        title: 'Lesson Review',
        type: 'REVIEW',
        order: 1,
        lessonId,
        content,
      },
      update: {
        content,
      },
    });
  }

  async findReview(lessonId: number) {
    return this.prisma.missionReview.findUnique({
      where: {
        lessonId,
      },
    });
  }

  async findDiagnosticTest(lessonId: number) {
    return this.prisma.missionDiagnosticTest.findFirst({
      where: {
        lessonId,
      },
      include: {
        questions: {
          orderBy: {
            order: 'asc',
          },
          include: {
            options: {
              orderBy: {
                order: 'asc',
              },
            },
          },
        },
      },
    });
  }

  async saveDiagnosticTest(
    lessonId: number,
    diagnosticTest: GeneratedDiagnosticTestOutputDto,
  ) {
    return this.prisma.missionDiagnosticTest.create({
      data: {
        title: 'Diagnostic Test',
        type: 'DIAGNOSTIC',
        order: 2,
        lessonId,

        questions: {
          create: diagnosticTest.questions.map((question, questionIndex) => ({
            text: question.question,
            type: question.type,
            topic: question.topic,
            order: questionIndex + 1,
            outcomeId: question.learningOutcomeId,
            options: {
              create: question.options.map((option, optionIndex) => ({
                text: option.text,
                isCorrect: option.isCorrect,
                order: optionIndex + 1,
              })),
            },
          })),
        },
      },
    });
  }
}
