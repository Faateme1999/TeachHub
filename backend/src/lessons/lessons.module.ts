import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { LessonsRepository } from './lessons.repository';

@Module({
  imports: [PrismaModule],
  providers: [LessonsService, LessonsRepository],
  controllers: [LessonsController],
})
export class LessonsModule {}
