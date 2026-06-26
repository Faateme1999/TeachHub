import { PartialType } from '@nestjs/mapped-types';
import { CreateCourseDto } from './create-course.dto';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {}

// PartialType(CreateCourseDto) already generates:
//   title?: string;
//   description?: string;
//   price?: number;
