export class GeneratedOptionDto {
  text: string;
  isCorrect: boolean;
}

export class GeneratedQuestionDto {
  text: string;
  type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE';
  options: GeneratedOptionDto[];
}

export class GeneratedMissionDto {
  title: string;
  passingScore: number;
  maxAttempts: number;
  questions: GeneratedQuestionDto[];
}

export class GeneratedMissionsResponseDto {
  missions: GeneratedMissionDto[];
}
