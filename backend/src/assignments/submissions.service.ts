import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SubmissionsRepository } from './submissions.repository';
import { CreateCorrectedAssignmentDto } from './dto/create-corrected-assignment';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class SubmissionsService {
  constructor(
    private readonly submissionsRepository: SubmissionsRepository,
    private readonly prisma: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  async findAssignment(assignmentId: number) {
    const assignment = await this.prisma.assignment.findUnique({
      where: {
        id: assignmentId,
      },
    });

    if (!assignment) {
      throw new NotFoundException(
        await this.i18n.translate('common.assignment.notFound', {
          args: { id: assignmentId },
        }),
      );
    }

    return assignment;
  }

  async upsert(assignmentId: number, userId: number, file: any) {
    if (!file) {
      throw new BadRequestException(
        await this.i18n.translate('common.submission.fileRequired'),
      );
    }
    await this.findAssignment(assignmentId);

    const existingSubmission =
      await this.submissionsRepository.findUniqueSubmissionByUserAndAssignment(
        assignmentId,
        userId,
      );

    if (existingSubmission?.correctedFileData) {
      throw new BadRequestException(
        await this.i18n.translate('common.submission.alreadyCorrected'),
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
      throw new NotFoundException(
        await this.i18n.translate('common.submission.notFound', {
          args: { id: submissionId },
        }),
      );
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
      throw new BadRequestException(
        await this.i18n.translate('common.submission.correctedFileRequired'),
      );
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
        await this.i18n.translate('common.submission.correctedFileNotFound'),
      );
    }
    if (!submission.correctedFileName || !submission.correctedFileData) {
      throw new NotFoundException(
        await this.i18n.translate('common.submission.correctedFileNotUploaded'),
      );
    }
    return submission;
  }
}
