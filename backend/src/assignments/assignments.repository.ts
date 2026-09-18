import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';

@Injectable()
export class AssignmentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(lessonId: number, createAssignmentDto: CreateAssignmentDto) {
    return this.prisma.assignment.create({
      data: {
        title: createAssignmentDto.title,
        description: createAssignmentDto.description,
        deadline: new Date(createAssignmentDto.deadline),
        lessonId,
      },
    });
  }

  async getAssignmentsByLessonId(lessonId: number, userId: number) {
    return this.prisma.assignment.findMany({
      where: {
        lessonId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        submissions: {
          where: {
            userId,
          },
          select: {
            id: true,
            fileName: true,
            correctedFileName: true,
            feedback: true,
          },
        },
      },
    });
  }
}
