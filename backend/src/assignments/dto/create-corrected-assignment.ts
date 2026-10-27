import { IsOptional, IsString } from 'class-validator';

export class CreateCorrectedAssignmentDto {
  @IsOptional()
  @IsString()
  feedback?: string;
}
