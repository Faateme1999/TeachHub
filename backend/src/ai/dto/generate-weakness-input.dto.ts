export class GenerateWeaknessInputDto {
  learningOutcome: string;
  topic: string;
  
  questions: {
    questionId: number;
    question: string;
    options: {
      id: number;
      text: string;
      isCorrect: boolean;
    }[];
    selectedOptionIds: number[];
  }[];
}
