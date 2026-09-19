import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SubmissionsRepository } from './submissions.repository';
import { CreateCorrectedAssignmentDto } from './dto/create-corrected-assignment';

@Injectable()
export class SubmissionsService {
  constructor(
    private readonly submissionsRepository: SubmissionsRepository,
    private readonly prisma: PrismaService,
  ) {}

  async findAssignment(assignmentId: number) {
    const assignment = await this.prisma.assignment.findUnique({
      where: {
        id: assignmentId,
      },
    });

    if (!assignment) {
      throw new NotFoundException(`Assignment ${assignmentId} not found`);
    }

    return assignment;
  }

  async upsert(assignmentId: number, userId: number, file: any) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    await this.findAssignment(assignmentId);

    const existingSubmission =
      await this.submissionsRepository.findUniqueSubmissionByUserAndAssignment(
        assignmentId,
        userId,
      );

    if (existingSubmission?.correctedFileData) {
      throw new BadRequestException(
        'You cannot submit the assignment again because it has already been corrected',
      );
    }

    return this.submissionsRepository.upsert(
      assignmentId,
      userId,
      file.originalname,
      file.buffer,
      //   file.buffer contains the actual binary content of the uploaded file.
    );
  }

  async downloadAssignmentFile(submissionId: number) {
    const submission =
      await this.submissionsRepository.downloadAssignmentFile(submissionId);
    if (!submission) {
      throw new NotFoundException(`Submission ${submissionId} not found`);
    }
    return submission;
  }

  async uploadCorrectedFile(
    assignmentId: number,
    submissionId: number,
    correctedFile: any,
    createCorrectedAssignmentDto: CreateCorrectedAssignmentDto,
  ) {
    if (!correctedFile) {
      throw new BadRequestException('Corrected file is required');
    }
    await this.findAssignment(assignmentId);

    return this.submissionsRepository.uploadCorrectedFile(
      submissionId,
      correctedFile.originalname,
      correctedFile.buffer,
      createCorrectedAssignmentDto.feedback,
    );
  }

  async downloadCorrectedFile(
    assignmentId: number,
    submissionId: number,
    userId: number,
  ) {
    await this.findAssignment(assignmentId);
    const submission = await this.submissionsRepository.downloadCorrectedFile(
      assignmentId,
      submissionId,
      userId,
    );
    if (!submission) {
      throw new NotFoundException(
        'Corrected file not found for this submission',
      );
    }
    if (!submission.correctedFileName || !submission.correctedFileData) {
      throw new NotFoundException('Corrected file has not been uploaded yet');
    }
    return submission;
  }
}
