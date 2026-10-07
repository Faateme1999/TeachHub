import { IsArray, IsInt, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class SubmitDiagnosticAnswerDto {
  @IsInt()
  questionId: number;

  @IsArray()
  @IsInt({ each: true })
  selectedOptionIds: number[];
}

export class SubmitDiagnosticTestDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubmitDiagnosticAnswerDto)
  answers: SubmitDiagnosticAnswerDto[];
}
