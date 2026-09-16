import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { Role } from '@prisma/client';

@Controller('lessons/:lessonId/assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  create(
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @Body()
    createAssignmentDto: CreateAssignmentDto,
  ) {
    return this.assignmentsService.create(lessonId, createAssignmentDto);
  }
}
