import { Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { MissionsService } from './missions.service';

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
}
