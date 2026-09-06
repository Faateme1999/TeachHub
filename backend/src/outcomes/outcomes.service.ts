import { Injectable, NotFoundException } from '@nestjs/common';
import { OutcomesRepository } from './outcomes.repository';
import { CreateOutcomeDto } from './dto/create-outcome-dto';
import { UpdateOutcomeDto } from './dto/update-outcome.dto';

@Injectable()
export class OutcomesService {
  constructor(private readonly outcomesRepository: OutcomesRepository) {}

  create(lessonId: number, dto: CreateOutcomeDto) {
    return this.outcomesRepository.create(lessonId, dto);
  }

  findAllOutcomesByLesson(lessonId: number) {
    return this.outcomesRepository.findAllOutcomesByLesson(lessonId);
  }

  private async findOutcomeOrThrow(lessonId: number, outcomeId: number) {
    const outcome = await this.outcomesRepository.findOutcome(
      lessonId,
      outcomeId,
    );

    if (!outcome) {
      throw new NotFoundException('Outcome not found');
    }

    return outcome;
  }

  async update(lessonId: number, outcomeId: number, dto: UpdateOutcomeDto) {
    await this.findOutcomeOrThrow(lessonId, outcomeId);
    return this.outcomesRepository.update(outcomeId, dto);
  }

  async remove(lessonId: number, outcomeId: number) {
    await this.findOutcomeOrThrow(lessonId, outcomeId);
    return this.outcomesRepository.remove(outcomeId);
  }

  findAllMissionsByOutcomeId(outcomeId: number) {
    return this.outcomesRepository.findAllMissionsByOutcomeId(outcomeId);
  }
}
