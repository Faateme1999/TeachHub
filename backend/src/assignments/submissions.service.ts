import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SubmissionsRepository } from './submissions.repository';
import type { Express } from 'express';

@Injectable()
export class SubmissionsService {
  constructor(
    private readonly submissionsRepository: SubmissionsRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(assignmentId: number, userId: number, file: any) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    const assignment = await this.prisma.assignment.findUnique({
      where: {
        id: assignmentId,
      },
    });

    if (!assignment) {
      throw new NotFoundException(`Assignment ${assignmentId} not found`);
    }

    await this.submissionsRepository.create(
      assignmentId,
      userId,
      file.originalname,
      file.buffer,
      //   file.buffer contains the actual binary content of the uploaded file.
    );
  }
}
