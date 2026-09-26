import { Injectable } from '@nestjs/common';
import { GeneratedMissionDto } from 'src/ai/dto/generated-mission.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MissionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  createMission(
    outcomeId: number,
    mission: GeneratedMissionDto,
    order: number,
  ) {
    return this.prisma.mission.create({
      data: {
        title: mission.title,
        order,
        passingScore: mission.passingScore,
        maxAttempts: mission.maxAttempts,
        outcomeId,
        // array.map((item, index) => ...)
        questions: {
          create: mission.questions.map((question, questionIndex) => ({
            text: question.text,
            type: question.type,
            order: questionIndex + 1,
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

  findAllQuestionsByMissionId(missionId: number) {
    return this.prisma.question.findMany({
      where: { missionId },
      orderBy: {
        order: 'asc',
      },
      select: {
        id: true,
        text: true,
        type: true,
        order: true,
        options: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            text: true,
            order: true,
          },
        },
      },
    });
  }

  findMission(missionId: number) {
    return this.prisma.mission.findUnique({
      where: { id: missionId },
      select: {
        id: true,
      },
    });
  }

  findMissionForSubmission(missionId: number) {
    return this.prisma.mission.findUnique({
      where: { id: missionId },
      select: {
        id: true,
        passingScore: true,
        maxAttempts: true,
        questions: {
          select: {
            id: true,
            type: true,
            options: {
              select: {
                id: true,
                isCorrect: true,
              },
            },
          },
        },
      },
    });
  }

  findMissionResult(userId: number, missionId: number) {
    return this.prisma.missionResult.findUnique({
      where: {
        userId_missionId: {
          userId,
          missionId,
        },
      },
    });
  }

  saveMissionResult(
    userId: number,
    missionId: number,
    bestScore: number,
    passed: boolean,
    attemptsUsed: number,
  ) {
    return this.prisma.missionResult.upsert({
      where: {
        userId_missionId: {
          userId,
          missionId,
        },
      },
      update: {
        bestScore,
        passed,
        attemptsUsed,
      },
      create: {
        userId,
        missionId,
        bestScore,
        passed,
        attemptsUsed,
      },
    });
  }
}
