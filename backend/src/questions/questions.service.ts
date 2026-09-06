import { Injectable, NotFoundException } from '@nestjs/common';
import { QuestionsRepository } from './questions.repository';

@Injectable()
export class QuestionsService {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  private async findMissionOrThrow(missionId: number) {
    const mission = await this.questionsRepository.findMission(missionId);
    if (!mission) {
      throw new NotFoundException('Mission not found');
    }

    return mission;
  }

  async findAllQuestionsByMissionId(missionId: number) {
    await this.findMissionOrThrow(missionId);
    return this.questionsRepository.findAllQuestionsByMissionId(missionId);
  }
}
