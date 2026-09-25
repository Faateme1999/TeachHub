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
  questions: GeneratedQuestionDto[];
}

export class GeneratedMissionsResponseDto {
  missions: GeneratedMissionDto[];
}
