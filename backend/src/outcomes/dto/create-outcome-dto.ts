import { IsString, MinLength } from 'class-validator';

export class CreateOutcomeDto {
  @IsString()
  @MinLength(5)
  text: string;
}
