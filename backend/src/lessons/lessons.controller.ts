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
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller()
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  // Writing lessons (create / update / delete) is an ADMIN-only action.
  // JwtAuthGuard verifies the token and sets req.user; RolesGuard then checks the
  // role. Reading lessons stays public so anyone can browse a course's curriculum.
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
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

  // Editing a lesson is ADMIN-only.
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('lessons/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLessonDto: UpdateLessonDto,
  ) {
    return this.lessonsService.update(id, updateLessonDto);
  }

  // Deleting a lesson is ADMIN-only.
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete('lessons/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.lessonsService.remove(id);
  }
}
