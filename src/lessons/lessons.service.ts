import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(courseId: number, createLessonDto: CreateLessonDto) {
    return this.prisma.lesson.create({
      data: {
        title: createLessonDto.title,
        content: createLessonDto.content,
        courseId,
      },
    });
  }

  async findAllByCourse(courseId: number) {
    return this.prisma.lesson.findMany({
      where: {
        courseId,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.lesson.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateLessonDto: UpdateLessonDto) {
    return this.prisma.lesson.update({
      where: {
        id,
      },
      data: updateLessonDto,
    });
  }

  async remove(id: number) {
    return this.prisma.lesson.delete({
      where: {
        id,
      },
    });
  }
}
