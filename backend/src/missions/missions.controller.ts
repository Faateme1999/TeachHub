import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { SubmitMissionDto } from './dto/submit-mission-dto';
import { MissionsService } from './missions.service';

@Controller('missions')
export class MissionsController {
  constructor(private readonly missionsService: MissionsService) {}

  @Get('/:missionId/questions')
  findAllQuestionsByMissionId(
    @Param('missionId', ParseIntPipe) missionId: number,
  ) {
    return this.missionsService.findAllQuestionsByMissionId(missionId);
  }

  @Post(':missionId/submit')
  submitMission(
    @Param('missionId', ParseIntPipe) missionId: number,
    @Body() submitMissionDto: SubmitMissionDto,
  ) {
    return this.missionsService.submitMission(missionId, submitMissionDto);
  }
}
