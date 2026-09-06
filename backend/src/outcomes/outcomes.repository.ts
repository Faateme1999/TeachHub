import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOutcomeDto } from './dto/create-outcome-dto';
import { UpdateOutcomeDto } from './dto/update-outcome.dto';

@Injectable()
export class OutcomesRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(lessonId: number, dto: CreateOutcomeDto) {
    return this.prisma.outcome.create({
      data: {
        text: dto.text,
        lessonId,
      },
    });
  }

  findAllOutcomesByLesson(lessonId: number) {
    return this.prisma.outcome.findMany({
      where: {
        lessonId,
      },
    });
  }

  findOutcome(lessonId: number, outcomeId: number) {
    return this.prisma.outcome.findFirst({
      where: { id: outcomeId, lessonId },
    });
  }

  update(id: number, dto: UpdateOutcomeDto) {
    return this.prisma.outcome.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: number) {
    return this.prisma.outcome.delete({
      where: { id },
    });
  }

  findAllMissionsByOutcomeId(outcomeId: number) {
    return this.prisma.mission.findMany({
      where: { outcomeId },
      orderBy: {
        order: 'asc',
      },
    });
  }
}
