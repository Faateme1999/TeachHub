import { Module } from '@nestjs/common';
import { MissionsService } from './missions.service';
import { MissionsRepository } from './missions.repository';
import { MissionsController } from './missions.controller';

@Module({
  controllers: [MissionsController],
  providers: [MissionsService, MissionsRepository],
  exports: [MissionsService],
})
export class MissionsModule {}
