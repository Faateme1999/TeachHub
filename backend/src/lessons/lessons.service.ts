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

  private validateLessonData(data: {
    type?: LessonType | null;
    content?: string | null;
    meetingUrl?: string | null;
  }) {
    if (data.type === LessonType.LIVE && !data.meetingUrl) {
      throw new BadRequestException('meetingUrl is required for LIVE lessons');
    }
    if (data.type === LessonType.RECORDED && !data.content) {
      throw new BadRequestException('content is required for RECORDED lessons');
    }
  }

  async create(courseId: number, createLessonDto: CreateLessonDto) {
    this.validateLessonData(createLessonDto);
    return this.lessonsRepository.create(courseId, createLessonDto);
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

  async update(id: number, updateLessonDto: UpdateLessonDto) {
    const existingLesson = await this.findOne(id);
    // ... Spread Operator
    const updatedLesson = {
      ...existingLesson,
      ...updateLessonDto,
    };
    this.validateLessonData(updatedLesson);
    return this.lessonsRepository.update(id, updateLessonDto);
  }

  async remove(id: number) {
    // DRY principle ("Don't Repeat Yourself")
    await this.findOne(id);

    return this.lessonsRepository.remove(id);
  }
}
