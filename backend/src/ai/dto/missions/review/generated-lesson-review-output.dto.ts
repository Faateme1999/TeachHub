export type ReviewExampleType = 'code' | 'analogy' | 'real_world';

export class ReviewExampleDto {
  type: ReviewExampleType;
  content: string;
}

export class ReviewConceptDto {
  title: string;
  explanation: string;
  example: ReviewExampleDto[];
  keyTakeaway: string;
}

export class GeneratedLessonReviewOutputDto {
  concepts: ReviewConceptDto[];
}
