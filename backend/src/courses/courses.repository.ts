import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCourseDto: CreateCourseDto) {
    return this.prisma.course.create({
      data: createCourseDto,
    });
  }

  async findAll(skip: number, take: number) {
    return this.prisma.course.findMany({
      skip,
      take,
      // Return at most 6 courses.
    });
  }

  async count() {
    return this.prisma.course.count();
  }

  async findById(id: number) {
    return this.prisma.course.findUnique({
      where: { id },
      include: {
        lessons: true,
      },
    });
  }

  async update(id: number, updateCourseDto: UpdateCourseDto) {
    return this.prisma.course.update({
      where: {
        id,
      },
      data: updateCourseDto,
    });
  }

  async deleteCourseWithChildren(id: number) {
    return this.prisma.$transaction([
      this.prisma.lesson.deleteMany({
        where: {
          courseId: id,
        },
      }),

      this.prisma.enrollment.deleteMany({
        where: {
          courseId: id,
        },
      }),

      this.prisma.course.delete({
        where: {
          id,
        },
      }),
    ]);
  }
}
