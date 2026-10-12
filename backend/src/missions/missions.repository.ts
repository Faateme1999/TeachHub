import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GeneratedTestOutputDto } from 'src/ai/dto/missions/tests/generated-diagnostic-test-output.dto';
import { Prisma } from '@prisma/client';
import { GeneratedPracticalAssignmentOutputDto } from 'src/ai/dto/missions/practical-assignment/generated-practical-assignment-output.dto';

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
    return this.prisma.missionTest.findFirst({
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
    diagnosticTest: GeneratedTestOutputDto,
  ) {
    return this.prisma.missionTest.create({
      data: {
        title: 'Diagnostic Test',
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
    tx?: Prisma.TransactionClient,
  ) {
    const db = tx ?? this.prisma;
    return db.testAttempt.create({
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
    return this.prisma.missionTest.findUnique({
      where: { id: testId },
      include: {
        lesson: {
          select: {
            courseId: true,
          },
        },
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
    return this.prisma.testAttempt.findUnique({
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

  async saveStudentMistakes(
    userId: number,
    mistakes: {
      questionId: number;
      courseId: number;
      lessonId: number;
      outcomeId: number;
      topic: string;
    }[],
    tx?: Prisma.TransactionClient,
  ) {
    if (mistakes.length === 0) {
      return;
    }

    const db = tx ?? this.prisma;
    return db.studentMistake.createMany({
      data: mistakes.map((mistake) => ({
        userId,
        questionId: mistake.questionId,
        courseId: mistake.courseId,
        lessonId: mistake.lessonId,
        outcomeId: mistake.outcomeId,
        topic: mistake.topic,
      })),
    });
  }

  async saveDiagnosticAttemptWithMistakes(
    userId: number,
    testId: number,
    answers: {
      questionId: number;
      selectedOptionIds: number[];
      isCorrect: boolean;
    }[],
    score: number,
    mistakes: {
      questionId: number;
      courseId: number;
      lessonId: number;
      outcomeId: number;
      topic: string;
    }[],
  ) {
    return this.prisma.$transaction(async (tx) => {
      const attempt = await this.saveDiagnosticAttempt(
        userId,
        testId,
        answers,
        score,
        tx,
      );

      await this.saveStudentMistakes(userId, mistakes, tx);

      return attempt;
    });
  }

  async findLessonAndMistakesForPracticalAssignment(
    userId: number,
    LessonId: number,
  ) {
    return this.prisma.lesson.findUnique({
      where: {
        id: LessonId,
      },
      include: {
        outcomes: true,
        mistakes: {
          where: {
            userId,
          },
          include: {
            question: {
              include: {
                options: true,
                answers: {
                  where: {
                    attempt: {
                      userId,
                    },
                  },
                  include: {
                    selectedOptions: {
                      include: {
                        option: true,
                      },
                    },
                  },
                },
              },
            },
            outcome: true,
          },
        },
      },
    });
  }

  async savePracticalAssignment(
    userId: number,
    lessonId: number,
    assignment: GeneratedPracticalAssignmentOutputDto,
  ) {
    return this.prisma.assignment.create({
      data: {
        title: assignment.title,
        description: JSON.stringify(assignment.description),
        source: 'AI',
        createdForUserId: userId,
        lessonId,
      },
    });
  }
}
