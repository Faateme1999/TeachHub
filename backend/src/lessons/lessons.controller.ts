import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import type { Response } from 'express';

import { FileInterceptor } from '@nestjs/platform-express';

import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreateOutcomeDto } from 'src/outcomes/dto/create-outcome-dto';
import { OutcomesService } from 'src/outcomes/outcomes.service';
import { UpdateOutcomeDto } from 'src/outcomes/dto/update-outcome.dto';
import { Readable } from 'stream';

@Controller()
export class LessonsController {
  constructor(
    private readonly lessonsService: LessonsService,
    private readonly outcomesService: OutcomesService,
  ) {}

  // Writing lessons (create / update / delete) is an ADMIN-only action.
  // JwtAuthGuard verifies the token and sets req.user; RolesGuard then checks the
  // role. Reading lessons stays public so anyone can browse a course's curriculum.
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  @Post('courses/:courseId/lessons')
  @UseInterceptors(FileInterceptor('video'))
  create(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Body() createLessonDto: CreateLessonDto,
    @UploadedFile() videoData?: any,
  ) {
    return this.lessonsService.create(courseId, createLessonDto, videoData);
  }

  @Get('courses/:courseId/lessons')
  findAllByCourse(@Param('courseId', ParseIntPipe) courseId: number) {
    return this.lessonsService.findAllByCourse(courseId);
  }

  @Get('lessons/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.lessonsService.findOne(id);
  }

  // Editing a lesson is ADMIN-only.
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  @Patch('lessons/:id')
  @UseInterceptors(FileInterceptor('video'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLessonDto: UpdateLessonDto,
    @UploadedFile() video?: any,
  ) {
    return this.lessonsService.update(id, updateLessonDto, video);
  }

  // Deleting a lesson is ADMIN-only.
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  @Delete('lessons/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.lessonsService.remove(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  @Post('lessons/:lessonId/outcomes')
  createOutcome(
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @Body() createOutcomeDto: CreateOutcomeDto,
  ) {
    return this.outcomesService.create(lessonId, createOutcomeDto);
  }

  @Get('lessons/:lessonId/outcomes')
  findAllOutcomesByLesson(@Param('lessonId', ParseIntPipe) lessonId: number) {
    return this.outcomesService.findAllOutcomesByLesson(lessonId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  @Patch('lessons/:lessonId/outcomes/:outcomeId')
  updateOutcome(
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @Param('outcomeId', ParseIntPipe) outcomeId: number,
    @Body() updateOutcomeDto: UpdateOutcomeDto,
  ) {
    return this.outcomesService.update(lessonId, outcomeId, updateOutcomeDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  @Delete('lessons/:lessonId/outcomes/:outcomeId')
  removeOutcome(
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @Param('outcomeId', ParseIntPipe) outcomeId: number,
  ) {
    return this.outcomesService.remove(lessonId, outcomeId);
  }

  @Get('lessons/:lessonId/video')
  async getVideo(
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @Res() res: Response,
  ) {
    const video = await this.lessonsService.getVideo(lessonId);

    res.set({
      'Content-Type': 'video/mp4',
    });

    // Readable = a stream that can be read piece by piece.
    // Send it to the response as a stream.
    if (video instanceof Readable) {
      return video.pipe(res);
    }

    const buffer = Buffer.from(video);
    res.set({
      'Content-Length': buffer.length,
    });

    return res.send(buffer);
  }

  @Post('lessons/:lessonId/review')
  generateReview(@Param('lessonId', ParseIntPipe) lessonId: number) {
    return this.lessonsService.generateReview(lessonId);
  }
}
