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

import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { EnrollmentsService } from 'src/enrollments/enrollments.service';
import { Request } from '@nestjs/common';

@Controller('courses')
export class CoursesController {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly enrollmentsService: EnrollmentsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.coursesService.update(id, updateCourseDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/enroll')
  enroll(@Param('id', ParseIntPipe) courseId: number, @Request() req: any) {
    return this.enrollmentsService.enroll(req.user.id, courseId);
  }
  //   That request contains lots of information:
  //   {
  //   headers: {...},
  //   body: {...},
  //   params: {...},
  //   query: {...}
  // }
  //  POST /courses/1/enroll
  // Authorization: Bearer TOKEN
  // req = {
  //   headers: {
  //     authorization: 'Bearer TOKEN'
  //   },
  //   params: {
  //     id: '1'
  //   },
  //   body: {},
  // }
  //   after guard:
  // req = {
  //   headers: {...},
  //   params: {
  //     id: '1'
  //   },

  //   user: {
  //     id: 1,
  //     name: 'Nest',
  //     email: 'nest@example.com'
  //   }
  // }
}
