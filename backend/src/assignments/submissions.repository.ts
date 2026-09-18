import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubmissionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    assignmentId: number,
    userId: number,
    fileName: string,
    fileData: Uint8Array,
    // A type used to store binary data such as file contents
  ) {
    return this.prisma.submission.create({
      data: {
        assignmentId,
        userId,
        fileName,
        fileData: fileData as any,
      },
    });
  }

  async downloadAssignmentFile(submissionId: number) {
    return this.prisma.submission.findUnique({
      where: {
        id: submissionId,
      },
      select: {
        fileName: true,
        fileData: true,
      },
    });
  }

  async uploadCorrectedFile(
    submissionId: number,
    correctedFileName: string,
    correctedFileData: Uint8Array,
    feedback?: string,
  ) {
    return this.prisma.submission.update({
      where: {
        id: submissionId,
      },
      data: {
        correctedFileName,
        correctedFileData: correctedFileData as any,
        feedback,
      },
    });
  }
}
