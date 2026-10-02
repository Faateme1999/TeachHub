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
    videoKey?: string,
  ) {
    return this.prisma.lesson.create({
      data: {
        title: createLessonDto.title,
        content: createLessonDto.content,
        videoData: videoKey ? undefined : (videoData as any),
        // !! Double Negation
        // converts a value into a Boolean
        hasVideo: !!videoData || !!videoKey,
        videoKey,
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
        videoKey: true,
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
        videoKey: true,
      },
    });
  }

  async update(
    id: number,
    updateLessonDto: UpdateLessonDto,
    videoData?: Uint8Array,
    videoKey?: string,
  ) {
    return this.prisma.lesson.update({
      where: {
        id,
      },
      data: {
        ...updateLessonDto,
        ...(videoKey
          ? {
              videoKey,
              videoData: null,
              hasVideo: true,
            }
          : videoData
            ? {
                videoData: videoData as any,
                videoKey: null,
                hasVideo: true,
              }
            : {}),
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
        videoKey: true,
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

  async getVideo(lessonId: number) {
    return this.prisma.lesson.findUnique({
      where: { id: lessonId },
      select: {
        videoData: true,
      },
    });
  }

  async findLessonWithOutcomes(lessonId: number) {
    return this.prisma.lesson.findUnique({
      where: {
        id: lessonId,
      },
      select: {
        id: true,
        title: true,
        content: true,
        outcomes: {
          select: {
            text: true,
          },
        },
      },
    });
  }
}
