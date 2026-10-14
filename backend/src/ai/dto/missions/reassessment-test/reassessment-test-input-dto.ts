export class GenerateReassessmentTestInputDto {
  lessonTitle: string;
  lessonContent: string;

  learningOutcomes: {
    id: number;
    text: string;
  }[];

  mistakes: {
    learningOutcome: string;
    topic: string;
    question: string;
    selectedAnswers: string[];
    correctAnswers: string[];
  }[];
}
