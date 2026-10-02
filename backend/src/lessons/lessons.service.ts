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
import { StorageService } from 'src/storage/storage.service';
import { ConfigService } from '@nestjs/config';
import { AiService } from 'src/ai/ai.service';

@Injectable()
export class LessonsService {
  constructor(
    private readonly lessonsRepository: LessonsRepository,
    private readonly storageService: StorageService,
    private readonly configService: ConfigService,
    private readonly aiService: AiService,
    private readonly i18n: I18nService,
  ) {}

  private isProduction() {
    return this.configService.get<string>('NODE_ENV') === 'production';
  }

  private async validateLessonData(
    data: {
      type?: LessonType | null;
      content?: string | null;
      meetingUrl?: string | null;
    },
    videoData?: any,
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
    videoData?: any,
  ) {
    await this.validateLessonData(createLessonDto, videoData);

    let videoKey: string | undefined;
    let videoBuffer = videoData?.buffer;

    if (this.isProduction() && videoData) {
      videoKey = `lessons/${Date.now()}-${videoData.originalname}`;

      await this.storageService.uploadFile(
        videoData.buffer,
        videoKey,
        videoData.mimetype,
      );
      videoBuffer = undefined;
    }

    return this.lessonsRepository.create(
      courseId,
      createLessonDto,
      videoBuffer,
      videoKey,
    );
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
  async update(id: number, updateLessonDto: UpdateLessonDto, videoData?: any) {
    const existingLesson = await this.findOne(id);
    // ... Spread Operator
    const updatedLesson = {
      ...existingLesson,
      ...updateLessonDto,
    };
    await this.validateLessonData(updatedLesson, videoData);

    let videoBuffer = videoData?.buffer;
    let videoKey: string | undefined;

    if (this.isProduction() && videoData) {
      if (existingLesson.videoKey) {
        await this.storageService.deleteFile(existingLesson.videoKey);
      }

      videoKey = `lessons/${Date.now()}-${videoData.originalname}`;

      await this.storageService.uploadFile(
        videoData.buffer,
        videoKey,
        videoData.mimetype,
      );

      videoBuffer = undefined;
    }

    return this.lessonsRepository.update(
      id,
      updateLessonDto,
      videoBuffer,
      videoKey,
    );
  }

  async remove(id: number) {
    // DRY principle ("Don't Repeat Yourself")
    const lesson = await this.findOne(id);

    if (this.isProduction() && lesson.videoKey) {
      await this.storageService.deleteFile(lesson.videoKey);
    }

    return this.lessonsRepository.remove(id);
  }

  async getVideo(lessonId: number) {
    const lesson = await this.findOne(lessonId);

    if (!lesson.hasVideo) {
      throw new NotFoundException(
        await this.i18n.translate('common.lesson.noVideo'),
      );
    }

    if (this.isProduction()) {
      if (!lesson.videoKey) {
        throw new NotFoundException(
          await this.i18n.translate('common.lesson.videoNotFound'),
        );
      }

      const video = await this.storageService.getFile(lesson.videoKey);
      if (!video) {
        throw new NotFoundException(
          await this.i18n.translate('common.lesson.videoNotFound'),
        );
      }

      return video;
    }

    const video = await this.lessonsRepository.getVideo(lessonId);
    if (!video?.videoData) {
      throw new NotFoundException(
        await this.i18n.translate('common.lesson.videoNotFound'),
      );
    }
    return video.videoData;
  }

  async generateReview(lessonId: number) {
    console.log('>>> REVIEW SERVICE START:', lessonId);

    const lesson =
      await this.lessonsRepository.findLessonWithOutcomes(lessonId);

    console.log('>>> LESSON FOUND:', !!lesson);

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    console.log('>>> CALLING AI');

    // return this.aiService.generateLessonReview({
    //   lessonTitle: lesson.title,
    //   lessonContent: lesson.content ?? '',
    //   learningOutcomes: lesson.outcomes.map((outcome) => outcome.text),
    // });

    return {
      message: 'Review endpoint works',
      lessonId,
      title: lesson.title,
      outcomes: lesson.outcomes.map((outcome) => outcome.text),
    };
  }
}
