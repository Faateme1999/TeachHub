import { ArrayNotEmpty, IsArray, IsInt } from 'class-validator';

export class SubmitAnswerDto {
  @IsInt()
  questionId: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  optionIds: number[];
}
