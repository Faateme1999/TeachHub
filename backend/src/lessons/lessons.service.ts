import { Injectable, NotFoundException } from '@nestjs/common';
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
    const lesson = await this.prisma.lesson.findUnique({
      where: {
        id,
      },
    });
    if (!lesson) {
      throw new NotFoundException(`Lesson ${id} not found`);
    }

    return lesson;
  }

  async update(id: number, updateLessonDto: UpdateLessonDto) {
    await this.findOne(id);
    return this.prisma.lesson.update({
      where: {
        id,
      },
      data: updateLessonDto,
    });
  }

  async remove(id: number) {
    // DRY principle ("Don't Repeat Yourself")
    await this.findOne(id);
    return this.prisma.lesson.delete({
      where: {
        id,
      },
    });
  }
}
