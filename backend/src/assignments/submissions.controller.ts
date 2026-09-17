import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SubmissionsService } from './submissions.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('assignments/:assignmentId/submissions')
@UseGuards(JwtAuthGuard)
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  // Extract the file from the multipart/form-data request where the field name is file.
  // multipart/form-data is the request format, file is the field name, and FileInterceptor('file') extracts and processes that file field.
  create(
    @Param('assignmentId', ParseIntPipe) assignmentId: number,
    //  @UploadedFile() => NestJS parameter decorator
    @UploadedFile() file: any,
    @Req()
    req: any,
  ) {
    return this.submissionsService.create(assignmentId, req.user.id, file);
  }

  @Get(':submissionId/download')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  downloadAssignmentFile(
    @Param('submissionId', ParseIntPipe) submissionId: number,
  ) {
    return this.submissionsService.downloadAssignmentFile(submissionId);
  }
}
