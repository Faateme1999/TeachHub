import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { LessonsRepository } from './lessons.repository';
import { LessonType } from '@prisma/client';

@Injectable()
export class LessonsService {
  constructor(private readonly lessonsRepository: LessonsRepository) {}

  private validateLessonData(
    data: {
      type?: LessonType | null;
      content?: string | null;
      meetingUrl?: string | null;
    },
    videoData?: Buffer,
  ) {
    if (data.type === LessonType.LIVE && !data.meetingUrl) {
      throw new BadRequestException('meetingUrl is required for LIVE lessons');
    }
    if (data.type === LessonType.RECORDED && data.meetingUrl) {
      throw new BadRequestException(
        'meetingUrl is not allowed for RECORDED lessons',
      );
    }

    if (data.type === LessonType.RECORDED && !data.content && !videoData) {
      throw new BadRequestException(
        'At least one of content or video is required for RECORDED lessons',
      );
    }
  }

  async create(
    courseId: number,
    createLessonDto: CreateLessonDto,
    videoData?: Buffer,
  ) {
    this.validateLessonData(createLessonDto, videoData);
    return this.lessonsRepository.create(courseId, createLessonDto, videoData);
  }

  async findAllByCourse(courseId: number) {
    return this.lessonsRepository.findAllByCourse(courseId);
  }

  async findOne(id: number) {
    const lesson = await this.lessonsRepository.findOne(id);

    if (!lesson) {
      throw new NotFoundException(`Lesson ${id} not found`);
    }

    return lesson;
  }

  async update(
    id: number,
    updateLessonDto: UpdateLessonDto,
    videoData?: Buffer,
  ) {
    const existingLesson = await this.findOne(id);
    // ... Spread Operator
    const updatedLesson = {
      ...existingLesson,
      ...updateLessonDto,
    };
    this.validateLessonData(updatedLesson, videoData);
    return this.lessonsRepository.update(id, updateLessonDto, videoData);
  }

  async remove(id: number) {
    // DRY principle ("Don't Repeat Yourself")
    await this.findOne(id);

    return this.lessonsRepository.remove(id);
  }
}
