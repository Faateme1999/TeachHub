import { Module } from '@nestjs/common';
import { QuestionsController } from './missions.controller';
import { QuestionsService } from './missions.service';
import { QuestionsRepository } from './missions.repository';

@Module({
  controllers: [QuestionsController],
  providers: [QuestionsService, QuestionsRepository],
})
export class QuestionsModule {}
