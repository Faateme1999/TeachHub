import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { AssignmentsRepository } from './assignments.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AssignmentsService {
  constructor(
    private readonly assignmentsRepository: AssignmentsRepository,
    private readonly prisma: PrismaService,
  ) {}

  async findLesson(lessonId: number) {
    const lesson = await this.prisma.lesson.findUnique({
      where: {
        id: lessonId,
      },
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson ${lessonId} not found`);
    }

    return lesson;
  }

  async create(lessonId: number, createAssignmentDto: CreateAssignmentDto) {
    await this.findLesson(lessonId);

    return this.assignmentsRepository.create(lessonId, createAssignmentDto);
  }
}
