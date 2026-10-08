import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MissionsRepository } from './missions.repository';
import { AiService } from '../ai/ai.service';
import { LessonsService } from 'src/lessons/lessons.service';
import { SubmitDiagnosticTestDto } from './dto/submit-diagnostic-test.dto';
import { FindWeaknessesOutputDto } from './dto/find-weaknesses-output.dto';

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

    const diagnosticTest = await this.aiService.generateDiagnosticTest({
      learningOutcomes: lesson.outcomes,
    });

    const savedTest = await this.missionsRepository.saveDiagnosticTest(
      lessonId,
      diagnosticTest,
    );

    return savedTest;
  }

  async submitDiagnosticTest(
    userId: number,
    testId: number,
    dto: SubmitDiagnosticTestDto,
  ) {
    const test =
      await this.missionsRepository.findDiagnosticTestForSubmission(testId);
    if (!test) {
      throw new NotFoundException('Diagnostic test not found');
    }

    const submittedAnswers = dto.answers.map((answer) => {
      const question = test.questions.find((q) => q.id === answer.questionId);

      if (!question) {
        throw new BadRequestException(
          `Question ${answer.questionId} does not belong to this test`,
        );
      }

      const correctOptionIds = question.options
        .filter((option) => option.isCorrect)
        .map((option) => option.id)
        .sort((a, b) => a - b);

      const selectedOptionIds = [...answer.selectedOptionIds].sort(
        (a, b) => a - b,
      );

      const isCorrect =
        selectedOptionIds.length == correctOptionIds.length &&
        selectedOptionIds.every(
          (optionId, index) => optionId === correctOptionIds[index],
        );

      return {
        questionId: question.id,
        selectedOptionIds: answer.selectedOptionIds,
        isCorrect,
      };
    });

    const correctAnswers = submittedAnswers.filter(
      (answer) => answer.isCorrect,
    ).length;

    const score = (correctAnswers / test.questions.length) * 100;

    return this.missionsRepository.saveDiagnosticAttempt(
      userId,
      testId,
      submittedAnswers,
      score,
    );
  }

  async findWeaknesses(userId: number, testId: number) {
    const attempt = await this.missionsRepository.findDiagnosticAttempt(
      userId,
      testId,
    );

    if (!attempt) {
      throw new NotFoundException('Diagnostic test attempt not found');
    }

    const wrongAnswers = attempt.answers.filter((answer) => !answer.isCorrect);

    const weaknesses: {
      outcomeId: number;
      learningOutcome: string;
      topics: {
        topic: string;
        answers: typeof wrongAnswers;
      }[];
    }[] = [];

    for (const answer of wrongAnswers) {
      const outcomeId = answer.question.outcomeId;
      const learningOutcome = answer.question.outcome.text;
      const topic = answer.question.topic;

      let outcome = weaknesses.find((item) => item.outcomeId === outcomeId);
      if (!outcome) {
        outcome = {
          outcomeId,
          learningOutcome,
          topics: [],
        };

        weaknesses.push(outcome);
      }

      let topicGroup = outcome.topics.find((item) => item.topic === topic);
      if (!topicGroup) {
        topicGroup = {
          topic,
          answers: [],
        };
        outcome.topics.push(topicGroup);
      }
      topicGroup.answers.push(answer);
    }

    const aiRemediations: FindWeaknessesOutputDto[] = [];

    for (const outcome of weaknesses) {
      const outcomeRemediations: FindWeaknessesOutputDto['remediations'] = [];

      for (const topic of outcome.topics) {
        const remediations = await this.aiService.generateWeaknessRemediation({
          learningOutcome: outcome.learningOutcome,
          topic: topic.topic,
          questions: topic.answers.map((answer) => ({
            questionId: answer.questionId,
            question: answer.question.text,
            selectedAnswers: answer.selectedOptions.map((selectedOption) => {
              const option = answer.question.options.find(
                (option) => option.id === selectedOption.optionId,
              );
              return option?.text ?? '';
            }),
            correctAnswers: answer.question.options
              .filter((option) => option.isCorrect)
              .map((option) => option.text),
          })),
        });

        outcomeRemediations.push({
          explanations: remediations.explanations.map((explanation) => {
            const answer = topic.answers.find(
              (answer) => answer.questionId === explanation.questionId,
            );

            return {
              questionId: explanation.questionId,
              question: answer?.question.text ?? '',
              selectedAnswers:
                answer?.selectedOptions.map((selectedOption) => {
                  const option = answer.question.options.find(
                    (option) => option.id === selectedOption.optionId,
                  );

                  return option?.text ?? '';
                }) ?? [],
              correctAnswers:
                answer?.question.options
                  .filter((option) => option.isCorrect)
                  .map((option) => option.text) ?? [],
              explanation: explanation.explanation,
            };
          }),

          teaching: remediations.teaching,
        });
      }
      aiRemediations.push({
        outcomeId: outcome.outcomeId,
        learningOutcome: outcome.learningOutcome,
        remediations: outcomeRemediations,
      });
    }
    return aiRemediations;
  }
}
