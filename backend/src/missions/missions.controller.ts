import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { QuestionsService } from './missions.service';

@Controller('missions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get('/:missionId/questions')
  findAllQuestionsByMissionId(
    @Param('missionId', ParseIntPipe) missionId: number,
  ) {
    return this.questionsService.findAllQuestionsByMissionId(missionId);
  }
}
