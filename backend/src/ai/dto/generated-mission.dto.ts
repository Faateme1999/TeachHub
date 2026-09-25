export class GeneratedOptionDto {
  text: string;
  isCorrect: boolean;
}

export class GeneratedQuestionDto {
  text: string;
  options: GeneratedOptionDto[];
  type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE';
}

export class GeneratedMissionDto {
  title: string;
  questions: GeneratedQuestionDto[];
}

export class GeneratedMissionsResponseDto {
  missions: GeneratedMissionDto[];
}
