import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EnrollmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async enroll(userId: number, courseId: number) {
    // Check if already enrolled
    // Returns the first matching row
    const existingEnrollment = await this.prisma.enrollment.findFirst({
      where: {
        userId,
        courseId,
      },
    });

    if (existingEnrollment) {
      throw new BadRequestException('User is already enrolled in this course');
    }

    return this.prisma.enrollment.create({
      data: {
        userId,
        courseId,
      },
    });
  }

  async unenroll(userId: number, courseId: number) {
    const enrollment = await this.prisma.enrollment.findFirst({
      where: {
        userId,
        courseId,
      },
    });

    if (!enrollment) {
      throw new BadRequestException('User is not enrolled in this course');
    }

    return this.prisma.enrollment.delete({
      where: {
        id: enrollment.id,
      },
    });
  }

  async findUserCourses(userId: number) {
    const enrollments = await this.prisma.enrollment.findMany({
      where: {
        userId,
      },
      include: {
        course: true,
      },
      // Prisma automatically joins the Course table.
      //       SELECT *
      // FROM Enrollment e
      // JOIN Course c
      // ON e.courseId = c.id
      // After finding the enrollments, also fetch the related course.
      //      {
      //   "id": 1,
      //   "userId": 1,
      //   "courseId": 1,

      //   "course": {
      //     "id": 1,
      //     "title": "NestJS",
      //     "description": "...",
      //     "price": 50
      //   }
      // },
    });

    return enrollments.map((enrollment) => enrollment.course);
  }
}
