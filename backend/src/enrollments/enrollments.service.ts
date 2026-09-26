import { BadRequestException, Injectable } from '@nestjs/common';
import { EnrollmentsRepository } from './enrollments.repository';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class EnrollmentsService {
  constructor(private readonly enrollmentsRepository: EnrollmentsRepository,
    private readonly i18n: I18nService,
  ) { }

  async enroll(userId: number, courseId: number) {
    // Check if already enrolled
    // Returns the first matching row
    const existingEnrollment =
      await this.enrollmentsRepository.findExistingEnrollment(userId, courseId);

    if (existingEnrollment) {
      throw new BadRequestException(
        await this.i18n.translate('common.enrollment.alreadyEnrolled'),
      );
    }
    return this.enrollmentsRepository.create(userId, courseId);
  }

  async unenroll(userId: number, courseId: number) {
    const enrollment = await this.enrollmentsRepository.findExistingEnrollment(
      userId,
      courseId,
    );

    if (!enrollment) {
      throw new BadRequestException(
        await this.i18n.translate('common.enrollment.notEnrolled'),
      );
    }

    return this.enrollmentsRepository.delete(enrollment.id);
  }

  async findUserCourses(userId: number) {
    const enrollments =
      await this.enrollmentsRepository.findUserCourses(userId);

    return enrollments.map((enrollment) => enrollment.course);
  }
}
