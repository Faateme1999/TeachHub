import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { LessonsRepository } from './lessons.repository';
import { OutcomesModule } from 'src/outcomes/outcomes.module';
import { StorageModule } from 'src/storage/storage.module';
import { AiModule } from 'src/ai/ai.module';

@Module({
  imports: [PrismaModule, OutcomesModule, StorageModule, AiModule],
  providers: [LessonsService, LessonsRepository],
  controllers: [LessonsController],
})
export class LessonsModule {}
