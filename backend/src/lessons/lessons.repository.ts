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
        // !! Double Negation
        // converts a value into a Boolean
        hasVideo: !!videoData,
        meetingUrl: createLessonDto.meetingUrl,
        type: createLessonDto.type,
        courseId,
      },
      select: {
        id: true,
        title: true,
        content: true,
        meetingUrl: true,
        type: true,
        courseId: true,
        createdAt: true,
        hasVideo: true,
      },
    });
  }

  async findAllByCourse(courseId: number) {
    return this.prisma.lesson.findMany({
      where: {
        courseId,
      },
      select: {
        id: true,
        title: true,
        content: true,
        meetingUrl: true,
        type: true,
        courseId: true,
        createdAt: true,
        hasVideo: true,
      },
    });

    // const videoLessonIds=
  }

  async findOne(id: number) {
    return this.prisma.lesson.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        title: true,
        content: true,
        meetingUrl: true,
        type: true,
        courseId: true,
        createdAt: true,
        hasVideo: true,
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
      data: {
        ...updateLessonDto,
        ...(videoData && {
          videoData: videoData as any,
          hasVideo: true,
        }),
      },
      select: {
        id: true,
        title: true,
        content: true,
        meetingUrl: true,
        type: true,
        courseId: true,
        createdAt: true,
        hasVideo: true,
      },
    });
  }

  async remove(id: number) {
    await this.prisma.lesson.delete({
      where: {
        id,
      },
    });
    return {
      message: 'Lesson deleted successfully',
    };
  }

}
