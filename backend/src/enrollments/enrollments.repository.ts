import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EnrollmentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findExistingEnrollment(userId: number, courseId: number) {
    return this.prisma.enrollment.findFirst({
      where: {
        userId,
        courseId,
      },
    });
  }

  async create(userId: number, courseId: number) {
    return this.prisma.enrollment.create({
      data: {
        userId,
        courseId,
      },
    });
  }

  async delete(id: number) {
    return this.prisma.enrollment.delete({
      where: {
        id,
      },
    });
  }

  async findUserCourses(userId: number) {
    return this.prisma.enrollment.findMany({
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
  }
}
