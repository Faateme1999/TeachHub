import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
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

  // NOTE: this must be declared BEFORE `@Get(':id')` in NestJS route order is not
  // an issue here because the path suffix ('/courses') is different — but keeping
  // related routes together makes the file easier to read.
  @Get(':id/courses')
  userCourses(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findCoursesByUserId(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id/role')
  updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserRoleDto,
  ) {
    return this.usersService.updateRole(id, dto.role);
  }

  @Get(':id')
  // matches anything after /users/.
  findOne(@Param('id', ParseIntPipe) id: number) {
    // Take the value from the URL parameter called id.
    // everything coming from a URL arrives as text.
    return this.usersService.findById(id);
  }
}
