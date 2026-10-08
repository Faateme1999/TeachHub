export class FindWeaknessesOutputDto {
  outcomeId: number;
  learningOutcome: string;

  remediations: {
    explanations: {
      questionId: number;
      question: string;
      selectedAnswers: string[];
      correctAnswers: string[];
      explanation: string;
    }[];

    teaching: {
      explanation: string;
      example: string;
      takeaway: string;
    };
  }[];
}
