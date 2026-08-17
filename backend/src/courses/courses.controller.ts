import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { EnrollmentsService } from 'src/enrollments/enrollments.service';
import { Request } from '@nestjs/common';

@Controller('courses')
export class CoursesController {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly enrollmentsService: EnrollmentsService,
  ) {}

  // Creating a course is an ADMIN-only action. JwtAuthGuard runs first (verifies
  // the token and sets req.user), then RolesGuard checks req.user.role === ADMIN.
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  // @Query() tells NestJS:"Get something from the URL's query parameters."
  // GET /courses?page=2
  // The part after ? is the query string:
  // ?page=2
  // NestJS receives query parameters as strings.
  @Get()
  findAll(@Query('page') page?: string) {
    return this.coursesService.findAll(page);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.findById(id);
  }

  // Editing a course is ADMIN-only.
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.coursesService.update(id, updateCourseDto);
  }

  // Deleting a course is ADMIN-only.
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.remove(id);
  }

  // Enrolling is a STUDENT action — keep it open to ANY logged-in user.
  // (Only JwtAuthGuard here — deliberately NO RolesGuard/@Roles.)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.STUDENT)
  @Post(':id/enroll')
  enroll(@Param('id', ParseIntPipe) courseId: number, @Request() req: any) {
    return this.enrollmentsService.enroll(req.user.id, courseId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.STUDENT)
  @Delete(':id/enroll')
  unenroll(@Param('id', ParseIntPipe) courseId: number, @Request() req: any) {
    return this.enrollmentsService.unenroll(req.user.id, courseId);
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
