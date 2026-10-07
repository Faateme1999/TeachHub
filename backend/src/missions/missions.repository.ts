import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GeneratedDiagnosticTestOutputDto } from 'src/ai/dto/generated-diagnostic-test-output.dto';

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

  async saveDiagnosticAttempt(
    userId: number,
    testId: number,
    answers: {
      questionId: number;
      selectedOptionIds: number[];
      isCorrect: boolean;
    }[],
    score: number,
  ) {
    return this.prisma.diagnosticTestAttempt.create({
      data: {
        userId,
        testId,
        attemptNumber: 1,
        score,
        answers: {
          create: answers.map((answer) => ({
            questionId: answer.questionId,
            isCorrect: answer.isCorrect,
            selectedOptions: {
              create: answer.selectedOptionIds.map((optionId) => ({
                optionId,
              })),
            },
          })),
        },
      },
      include: {
        answers: {
          include: {
            selectedOptions: true,
          },
        },
      },
    });
  }

  async findDiagnosticTestForSubmission(testId: number) {
    return this.prisma.missionDiagnosticTest.findUnique({
      where: { id: testId },
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

  async findDiagnosticAttempt(userId: number, testId: number) {
    return this.prisma.diagnosticTestAttempt.findUnique({
      where: {
        userId_testId: {
          userId,
          testId,
        },
      },
      include: {
        answers: {
          include: {
            question: {
              include: {
                options: true,
                outcome: true,
              },
            },
            selectedOptions: true,
          },
        },
      },
    });
  }
}
