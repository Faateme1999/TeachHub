import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GeneratedTestOutputDto } from 'src/ai/dto/missions/diagnostic-test/generated-diagnostic-test-output.dto';
import { Prisma, TestType } from '@prisma/client';
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

  async findTest(
    lessonId: number,
    testType: TestType,
    createdForUserId: number | null,
  ) {
    return this.prisma.missionTest.findFirst({
      where: {
        lessonId,
        testType,
        createdForUserId,
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

  async saveTest(
    lessonId: number,
    test: GeneratedTestOutputDto,
    testType: TestType,
    createdForUserId: number | null,
  ) {
    return this.prisma.missionTest.create({
      data: {
        title:
          testType === TestType.DIAGNOSTIC
            ? 'Diagnostic Test'
            : 'Reassessment Test',
        testType,
        createdForUserId,
        lessonId,
        questions: {
          create: test.questions.map((question, questionIndex) => ({
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

  async saveTestAttempt(
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

  async findTestForSubmission(testId: number) {
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

  async findAttempt(userId: number, testId: number) {
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
    testId: number,
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
        testId,
        questionId: mistake.questionId,
        courseId: mistake.courseId,
        lessonId: mistake.lessonId,
        outcomeId: mistake.outcomeId,
        topic: mistake.topic,
      })),
    });
  }

  async saveTestAttemptWithMistakes(
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
      const attempt = await this.saveTestAttempt(
        userId,
        testId,
        answers,
        score,
        tx,
      );

      await this.saveStudentMistakes(userId, testId, mistakes, tx);

      return attempt;
    });
  }

  async findLessonAndMistakes(userId: number, LessonId: number) {
    return this.prisma.lesson.findUnique({
      where: {
        id: LessonId,
      },
      include: {
        outcomes: true,
        mistakes: {
          where: {
            userId,
            test: {
              testType: TestType.DIAGNOSTIC,
            },
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
                    attempt: {
                      select: {
                        testId: true,
                      },
                    },
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
