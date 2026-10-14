import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MissionsService } from './missions.service';
import { SubmitTestDto } from './dto/submit-test.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('missions')
export class MissionsController {
  constructor(private readonly missionsService: MissionsService) {}

  @Post('lessons/:lessonId/review')
  generateReview(@Param('lessonId', ParseIntPipe) lessonId: number) {
    return this.missionsService.generateReview(lessonId);
  }

  @Post('lessons/:lessonId/diagnostic-test')
  generateTest(@Param('lessonId', ParseIntPipe) lessonId: number) {
    return this.missionsService.generateTest(lessonId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('diagnostic-tests/:testId/submit')
  submitTest(
    @Param('testId', ParseIntPipe) testId: number,
    @Body() dto: SubmitTestDto,
    @Req() req: any,
  ) {
    return this.missionsService.submitTest(req.user.id, testId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('diagnostic-tests/:testId/weaknesses')
  findWeaknesses(
    @Param('testId', ParseIntPipe) testId: number,
    @Req() req: any,
  ) {
    return this.missionsService.findWeaknesses(req.user.id, testId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('lessons/:lessonId/practical-assignment')
  generatePracticalAssignment(
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @Req() req: any,
  ) {
    return this.missionsService.generatePracticalAssignment(
      req.user.id,
      lessonId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('lessons/:lessonId/reassessment-test')
  generateReassessmentTest(
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @Req() req: any,
  ) {
    return this.missionsService.generateReassessmentTest(req.user.id, lessonId);
  }
}
