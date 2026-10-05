import { Injectable } from '@nestjs/common';
import { MissionsRepository } from './missions.repository';
import { AiService } from '../ai/ai.service';
import { LessonsService } from 'src/lessons/lessons.service';

@Injectable()
export class MissionsService {
  constructor(
    private readonly missionsRepository: MissionsRepository,
    private readonly lessonsService: LessonsService,
    private readonly aiService: AiService,
  ) {}

  async generateReview(lessonId: number) {
    const lesson =
      await this.lessonsService.findLessonWithOutcomesOrThrow(lessonId);

    const existingReview = await this.missionsRepository.findReview(lessonId);

    if (existingReview) {
      return existingReview.content;
    }

    const review = await this.aiService.generateLessonReview({
      lessonTitle: lesson.title,
      lessonContent: lesson.content ?? '',
      learningOutcomes: lesson.outcomes.map((outcome) => outcome.text),
    });

    await this.missionsRepository.saveReview(lessonId, review);
    return review;
  }

  async generateDiagnosticTest(lessonId: number) {
    const lesson =
      await this.lessonsService.findLessonWithOutcomesOrThrow(lessonId);

    const existingTest =
      await this.missionsRepository.findDiagnosticTest(lessonId);

    if (existingTest) {
      return existingTest;
    }

    const diagnosticTest = await this.aiService.generateDiagnosticQuestions({
      learningOutcomes: lesson.outcomes,
    });

    const savedTest = await this.missionsRepository.saveDiagnosticTest(
      lessonId,
      diagnosticTest,
    );

    return savedTest;
  }
}
