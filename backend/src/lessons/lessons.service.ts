import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { LessonsRepository } from './lessons.repository';
import { LessonType } from '@prisma/client';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class LessonsService {
  constructor(
    private readonly lessonsRepository: LessonsRepository,
    private readonly i18n: I18nService,
  ) {}

  private async validateLessonData(
    data: {
      type?: LessonType | null;
      content?: string | null;
      meetingUrl?: string | null;
    },
    videoData?: Buffer,
  ) {
    if (data.type === LessonType.LIVE && !data.meetingUrl) {
      throw new BadRequestException(
        await this.i18n.translate('common.lesson.liveMeetingUrlRequired'),
      );
    }
    if (data.type === LessonType.RECORDED && data.meetingUrl) {
      throw new BadRequestException(
        await this.i18n.translate('common.lesson.recordedMeetingUrlNotAllowed'),
      );
    }

    if (data.type === LessonType.RECORDED && !data.content && !videoData) {
      throw new BadRequestException(
        await this.i18n.translate(
          'common.lesson.recordedContentOrVideoRequired',
        ),
      );
    }
  }

  async create(
    courseId: number,
    createLessonDto: CreateLessonDto,
    videoData?: Buffer,
  ) {
    await this.validateLessonData(createLessonDto, videoData);
    return this.lessonsRepository.create(courseId, createLessonDto, videoData);
  }

  async findAllByCourse(courseId: number) {
    return this.lessonsRepository.findAllByCourse(courseId);
  }

  async findOne(id: number) {
    const lesson = await this.lessonsRepository.findOne(id);

    if (!lesson) {
      throw new NotFoundException(
        await this.i18n.translate('common.lesson.notFound', {
          args: { id },
        }),
      );
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
    await this.validateLessonData(updatedLesson, videoData);
    return this.lessonsRepository.update(id, updateLessonDto, videoData);
  }

  async remove(id: number) {
    // DRY principle ("Don't Repeat Yourself")
    await this.findOne(id);

    return this.lessonsRepository.remove(id);
  }

  async getVideo(lessonId: number) {
    const lesson = await this.findOne(lessonId);

    if (!lesson.hasVideo) {
      throw new NotFoundException(
        await this.i18n.translate('common.lesson.noVideo'),
      );
    }

    const video = await this.lessonsRepository.getVideo(lessonId);
    if (!video) {
      throw new NotFoundException(
        await this.i18n.translate('common.lesson.videoNotFound'),
      );
    }
    return video;
  }
}
