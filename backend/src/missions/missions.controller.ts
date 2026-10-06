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
import { SubmitDiagnosticTestDto } from './dto/submit-diagnostic-test.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('missions')
export class MissionsController {
  constructor(private readonly missionsService: MissionsService) {}

  @Post('lessons/:lessonId/review')
  generateReview(@Param('lessonId', ParseIntPipe) lessonId: number) {
    return this.missionsService.generateReview(lessonId);
  }

  @Post('lessons/:lessonId/diagnostic-test')
  generateDiagnosticTest(@Param('lessonId', ParseIntPipe) lessonId: number) {
    return this.missionsService.generateDiagnosticTest(lessonId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('diagnostic-tests/:testId/submit')
  submitDiagnosticTest(
    @Param('testId', ParseIntPipe) testId: number,
    @Body() dto: SubmitDiagnosticTestDto,
    @Req() req: any,
  ) {
    return this.missionsService.submitDiagnosticTest(req.user.id, testId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('diagnostic-tests/:testId/weaknesses')
  findWeaknesses(
    @Param('testId', ParseIntPipe) testId: number,
    @Req() req: any,
  ) {
    return this.missionsService.findWeaknesses(req.user.id, testId);
  }
}
