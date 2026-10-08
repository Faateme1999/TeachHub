export type DiagnosticQuestionType = 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE';

export class DiagnosticOptionDto {
  text: string;
  isCorrect: boolean;
}

export class DiagnosticQuestionDto {
  question: string;
  type: DiagnosticQuestionType;
  options: DiagnosticOptionDto[];
  learningOutcomeId: number;
  topic: string;
}

export class GeneratedDiagnosticTestOutputDto {
  questions: DiagnosticQuestionDto[];
}
