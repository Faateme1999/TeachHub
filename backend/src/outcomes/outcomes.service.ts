import { Injectable, NotFoundException } from '@nestjs/common';
import { OutcomesRepository } from './outcomes.repository';
import { CreateOutcomeDto } from './dto/create-outcome-dto';
import { UpdateOutcomeDto } from './dto/update-outcome.dto';
import { AiService } from '../ai/ai.service';
import { MissionsService } from 'src/missions/missions.service';

@Injectable()
export class OutcomesService {
  constructor(
    private readonly outcomesRepository: OutcomesRepository,
    private readonly aiService: AiService,
    private readonly missionsService: MissionsService,
  ) {}

  async create(lessonId: number, dto: CreateOutcomeDto) {
    const outcome = await this.outcomesRepository.create(lessonId, dto);
    const generatedMissions = await this.aiService.generateMissions(
      outcome.text,
    );

    const missions = await Promise.all(
      generatedMissions.missions.map((mission, index) =>
        this.missionsService.createMission(outcome.id, mission, index + 1),
      ),
    );

    return { outcome, missions };
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
