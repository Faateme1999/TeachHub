import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // TODO(junior) — US-025: the features doc says viewing all users should require
  // a logged-in user. To enforce that, add the guard here (same as the routes below):
  //   @UseGuards(JwtAuthGuard)
  // It's left public for now so the list keeps working while you learn the token
  // flow — the frontend only calls it from authenticated pages anyway.
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // Specific routes first
  @Get('my-profile')
  @UseGuards(JwtAuthGuard)
  profile(@Request() req: any) {
    return req.user;
  }

  @Get('me/courses')
  @UseGuards(JwtAuthGuard)
  myCourses(@Request() req: any) {
    return this.usersService.findUserCourses(req.user.id);
  }

  // US-028: view the courses a SPECIFIC user (by id) is enrolled in.
  // NOTE: this must be declared BEFORE `@Get(':id')` in NestJS route order is not
  // an issue here because the path suffix ('/courses') is different — but keeping
  // related routes together makes the file easier to read.
  // The service method it calls is a STUB (returns 501) — see users.service.ts
  // and docs/junior-dev-tasks.md for how to finish it.
  @Get(':id/courses')
  userCourses(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findCoursesByUserId(id);
  }

  @Get(':id')
  // matches anything after /users/.
  findOne(@Param('id', ParseIntPipe) id: number) {
    // Take the value from the URL parameter called id.
    // everything coming from a URL arrives as text.
    return this.usersService.findById(id);
  }
}
