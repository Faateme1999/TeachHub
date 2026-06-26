import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { EnrollmentsModule } from 'src/enrollments/enrollments.module';

@Module({
  imports: [EnrollmentsModule],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
