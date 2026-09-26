import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { AssignmentsRepository } from './assignments.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class AssignmentsService {
  constructor(
    private readonly assignmentsRepository: AssignmentsRepository,
    private readonly prisma: PrismaService,
    private readonly i18n: I18nService,
  ) { }

  async findLesson(lessonId: number) {
    const lesson = await this.prisma.lesson.findUnique({
      where: {
        id: lessonId,
      },
    });

    if (!lesson) {
      throw new NotFoundException(
        await this.i18n.translate('common.lesson.notFound', {
          args: { id: lessonId },
        }),
      );
    }

    return lesson;
  }

  async create(lessonId: number, createAssignmentDto: CreateAssignmentDto) {
    await this.findLesson(lessonId);

    return this.assignmentsRepository.create(lessonId, createAssignmentDto);
  }

  async getAssignmentsByLessonId(lessonId: number, userId: number) {
    await this.findLesson(lessonId);
    return this.assignmentsRepository.getAssignmentsByLessonId(
      lessonId,
      userId,
    );
  }
}
