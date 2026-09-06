import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { OutcomesService } from './outcomes.service';

@Controller('outcomes')
export class OutcomesController {
  constructor(private readonly outcomesService: OutcomesService) {}

  @Get(':outcomeId/missions')
  findAllMissionsByOutcomeId(
    @Param('outcomeId', ParseIntPipe) outcomeId: number,
  ) {
    return this.outcomesService.findAllMissionsByOutcomeId(outcomeId);
  }
}
