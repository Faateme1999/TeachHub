import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller()
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  // Writing lessons (create / update / delete) requires a logged-in user.
  // @UseGuards(JwtAuthGuard) reads the "Authorization: Bearer <token>" header,
  // verifies the JWT, and rejects the request with 401 if it's missing/invalid.
  // Reading lessons stays public so anyone can browse a course's curriculum.
  @UseGuards(JwtAuthGuard)
  @Post('courses/:courseId/lessons')
  create(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Body() createLessonDto: CreateLessonDto,
  ) {
    return this.lessonsService.create(courseId, createLessonDto);
  }

  @Get('courses/:courseId/lessons')
  findAllByCourse(@Param('courseId', ParseIntPipe) courseId: number) {
    return this.lessonsService.findAllByCourse(courseId);
  }

  @Get('lessons/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.lessonsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('lessons/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLessonDto: UpdateLessonDto,
  ) {
    return this.lessonsService.update(id, updateLessonDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('lessons/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.lessonsService.remove(id);
  }
}
