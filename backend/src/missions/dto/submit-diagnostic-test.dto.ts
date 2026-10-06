export class SubmitDiagnosticAnswerDto {
  questionId: number;
  selectedOptionIds: number[];
}

export class SubmitDiagnosticTestDto {
  answers: SubmitDiagnosticAnswerDto[];
}
