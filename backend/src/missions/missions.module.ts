import { Module } from '@nestjs/common';
import { MissionsController } from './missions.controller';
import { MissionsService } from './missions.service';
import { MissionsRepository } from './missions.repository';
import { AiModule } from 'src/ai/ai.module';
import { LessonsModule } from 'src/lessons/lessons.module';

@Module({
  imports: [LessonsModule, AiModule],
  controllers: [MissionsController],
  providers: [MissionsService, MissionsRepository],
  exports: [MissionsService],
})
export class MissionsModule {}
