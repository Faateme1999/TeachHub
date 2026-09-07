import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class QuestionsRepository {
  constructor(private readonly prisma: PrismaService) {}

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
}
