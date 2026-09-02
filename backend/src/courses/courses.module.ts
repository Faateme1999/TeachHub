import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { CoursesRepository } from './courses.repository';
import { EnrollmentsModule } from 'src/enrollments/enrollments.module';

@Module({
  imports: [PrismaModule, EnrollmentsModule],

  controllers: [CoursesController],

  providers: [CoursesService, CoursesRepository],
})
export class CoursesModule {}
