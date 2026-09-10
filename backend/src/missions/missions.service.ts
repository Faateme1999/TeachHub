import { Injectable, NotFoundException } from '@nestjs/common';
import { MissionsRepository } from './missions.repository';
import { SubmitMissionDto } from './dto/submit-mission-dto';

@Injectable()
export class MissionsService {
  constructor(private readonly missionsRepository: MissionsRepository) {}

  private async findMissionOrThrow(missionId: number) {
    const mission = await this.missionsRepository.findMission(missionId);
    if (!mission) {
      throw new NotFoundException('Mission not found');
    }

    return mission;
  }

  private async findMissionForSubmissionOrThrow(missionId: number) {
    const mission =
      await this.missionsRepository.findMissionForSubmission(missionId);

    if (!mission) {
      throw new NotFoundException('Mission not found');
    }

    return mission;
  }

  async findAllQuestionsByMissionId(missionId: number) {
    await this.findMissionOrThrow(missionId);
    return this.missionsRepository.findAllQuestionsByMissionId(missionId);
  }

  async submitMission(missionId: number, submitMissionDto: SubmitMissionDto) {
    const mission = await this.findMissionForSubmissionOrThrow(missionId);

    let correctAnswers = 0;

    for (const question of mission?.questions) {
      const submittedAnswer = submitMissionDto.answers.find(
        (answer) => answer.questionId === question.id,
      );

      const correctOptionIds = question.options
        .filter((option) => option.isCorrect)
        .map((option) => option.id);

      const submittedOptionIds = submittedAnswer?.optionIds ?? [];

      const isCorrect =
        correctOptionIds.length === submittedOptionIds.length &&
        correctOptionIds.every((optionId) =>
          submittedOptionIds.includes(optionId),
        );

      if (isCorrect) {
        correctAnswers++;
      }
    }

    const totalQuestions = mission?.questions.length;
    const score =
      totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    return {
      score,
      passed: score >= mission?.passingScore,
    };
  }
}
