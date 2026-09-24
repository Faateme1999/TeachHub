import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    courseId: number,
    createLessonDto: CreateLessonDto,
    videoData?: Uint8Array,
  ) {
    return this.prisma.lesson.create({
      data: {
        title: createLessonDto.title,
        content: createLessonDto.content,
        videoData: videoData as any,
        meetingUrl: createLessonDto.meetingUrl,
        type: createLessonDto.type,
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

  async update(
    id: number,
    updateLessonDto: UpdateLessonDto,
    videoData?: Uint8Array,
  ) {
    return this.prisma.lesson.update({
      where: {
        id,
      },
      data: { ...updateLessonDto, videoData: videoData as any },
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
