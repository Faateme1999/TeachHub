import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { SubmitAnswerDto } from './submit-answer-dto';

export class SubmitMissionDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubmitAnswerDto)
  answers: SubmitAnswerDto[];
}

// {
//   "answers": [
//     {
//       "questionId": 1,
//       "optionIds": [1]
//     },
//     {
//       "questionId": 2,
//       "optionIds": [5, 6]
//     },
//     {
//       "questionId": 3,
//       "optionIds": [11]
//     }
//   ]
// }
