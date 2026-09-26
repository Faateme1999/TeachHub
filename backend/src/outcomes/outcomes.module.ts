import { Module } from '@nestjs/common';
import { OutcomesService } from './outcomes.service';
import { OutcomesController } from './outcomes.controller';
import { OutcomesRepository } from './outcomes.repository';
import { AiModule } from '../ai/ai.module';
import { MissionsModule } from '../missions/missions.module';

@Module({
  imports: [AiModule, MissionsModule],
  providers: [OutcomesService, OutcomesRepository],
  controllers: [OutcomesController],
  exports: [OutcomesService],
})
export class OutcomesModule {}
