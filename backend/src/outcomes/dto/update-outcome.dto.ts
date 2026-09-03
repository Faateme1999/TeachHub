import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateOutcomeDto {
  @IsOptional()
  @IsString()
  @MinLength(5)
  text?: string;
}
