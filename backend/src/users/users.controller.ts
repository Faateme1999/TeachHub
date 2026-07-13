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

  @Get(':id')
  // matches anything after /users/.
  findOne(@Param('id', ParseIntPipe) id: number) {
    // Take the value from the URL parameter called id.
    // everything coming from a URL arrives as text.
    return this.usersService.findById(id);
  }
}
