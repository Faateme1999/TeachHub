import { Module } from '@nestjs/common';
import { OutcomesService } from './outcomes.service';
import { OutcomesController } from './outcomes.controller';
import { OutcomesRepository } from './outcomes.repository';

@Module({
  providers: [OutcomesService, OutcomesRepository],
  controllers: [OutcomesController],
  exports: [OutcomesService],
})
export class OutcomesModule {}
