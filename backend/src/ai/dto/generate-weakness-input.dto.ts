export class GenerateWeaknessInputDto {
  learningOutcome: string;
  topic: string;

  questions: {
    questionId: number;
    question: string;
    selectedAnswers: string[];
    correctAnswers: string[];
  }[];
}
