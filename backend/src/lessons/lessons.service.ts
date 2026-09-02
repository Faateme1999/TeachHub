import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { LessonsRepository } from './lessons.repository';

@Injectable()
export class LessonsService {
  constructor(private readonly lessonsRepository: LessonsRepository) {}

  async create(courseId: number, createLessonDto: CreateLessonDto) {
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
    await this.findOne(id);

    return this.lessonsRepository.update(id, updateLessonDto);
  }

  async remove(id: number) {
    // DRY principle ("Don't Repeat Yourself")
    await this.findOne(id);

    return this.lessonsRepository.remove(id);
  }
}
