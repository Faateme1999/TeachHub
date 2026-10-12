export type TestQuestionType = 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE';

export class TestOptionDto {
  text: string;
  isCorrect: boolean;
}

export class TestQuestionDto {
  question: string;
  type: TestQuestionType;
  options: TestOptionDto[];
  learningOutcomeId: number;
  topic: string;
}

export class GeneratedTestOutputDto {
  questions: TestQuestionDto[];
}
