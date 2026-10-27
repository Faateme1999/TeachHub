export class GeneratePracticalAssignmentInputDto {
  lessonTitle: string;
  lessonContent: string;
  learningOutcomes: string[];

  mistakes: {
    learningOutcome: string;
    topic: string;
    question: string;
    selectedAnswers: string[];
    correctAnswers: string[];
  }[];
}
