import { Controller, Get } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('generate-missions')
  generate() {
    return this.aiService.generateMissions(
      'Student can implement JWT authentication in NestJS',
    );
  }
}
