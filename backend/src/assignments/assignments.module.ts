import { Module } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { AssignmentsController } from './assignments.controller';
import { AssignmentsRepository } from './assignments.repository';
import { SubmissionsController } from './submissions.controller';
import { SubmissionsRepository } from './submissions.repository';
import { SubmissionsService } from './submissions.service';

@Module({
  controllers: [AssignmentsController, SubmissionsController],
  providers: [
    AssignmentsService,
    AssignmentsRepository,
    SubmissionsService,
    SubmissionsRepository,
  ],
})
export class AssignmentsModule {}
