import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SubmitMissionDto } from './dto/submit-mission-dto';
import { MissionsService } from './missions.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('missions')
export class MissionsController {
  constructor(private readonly missionsService: MissionsService) {}

  @Get('/:missionId/questions')
  findAllQuestionsByMissionId(
    @Param('missionId', ParseIntPipe) missionId: number,
  ) {
    return this.missionsService.findAllQuestionsByMissionId(missionId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':missionId/submit')
  submitMission(
    @Param('missionId', ParseIntPipe) missionId: number,
    @Body() submitMissionDto: SubmitMissionDto,
    @Req() req: any,
  ) {
    const userId = req.user.id;

    return this.missionsService.submitMission(
      missionId,
      userId,
      submitMissionDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':missionId/result')
  getMissionResult(
    @Param('missionId', ParseIntPipe) missionId: number,
    @Req() req: any,
  ) {
    const userId = req.user.id;

    return this.missionsService.getMissionResult(userId, missionId);
  }
}
