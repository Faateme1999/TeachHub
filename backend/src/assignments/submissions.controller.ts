import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SubmissionsService } from './submissions.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import type { Response } from 'express';
import { Role } from '@prisma/client';
import { CreateCorrectedAssignmentDto } from './dto/create-corrected-assignment';

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
  async downloadAssignmentFile(
    @Param('submissionId', ParseIntPipe) submissionId: number,
    @Res() res: Response,
  ) {
    const submission =
      await this.submissionsService.downloadAssignmentFile(submissionId);

    res.set({
      // Set the HTTP response headers before sending the file.
      // Content-Type tells the browser that the response is binary file data.
      'Content-Type': 'application/octet-stream',

      // Content-Disposition tells the browser to download the file and use the original file name.
      'Content-Disposition': `attachment; filename="${submission.fileName}"`,
    });

    // Convert the stored binary data into a Node.js Buffer and send the actual file data to the browser.
    res.send(Buffer.from(submission.fileData));
  }

  @Post(':submissionId/correct')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  uploadCorrectedFile(
    @Param('assignmentId', ParseIntPipe) assignmentId: number,
    @Param('submissionId', ParseIntPipe) submissionId: number,
    @UploadedFile() correctedFile: any,
    @Body() createCorrectedAssignmentDto: CreateCorrectedAssignmentDto,
  ) {
    return this.submissionsService.uploadCorrectedFile(
      assignmentId,
      submissionId,
      correctedFile,
      createCorrectedAssignmentDto,
    );
  }
}
