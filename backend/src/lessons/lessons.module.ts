import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { LessonsRepository } from './lessons.repository';
import { OutcomesModule } from 'src/outcomes/outcomes.module';

@Module({
  imports: [PrismaModule, OutcomesModule],
  providers: [LessonsService, LessonsRepository],
  controllers: [LessonsController],
})
export class LessonsModule {}
