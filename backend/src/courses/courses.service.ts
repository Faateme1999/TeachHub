import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCourseDto: CreateCourseDto) {
    return this.prisma.course.create({
      data: createCourseDto,
    });
  }
  // Because Prisma's create() method is defined to expect an object with a property called data.
  // prisma.course.create({
  //   data: {
  //     title: 'NestJS',
  //     description: '...',
  //     price: 49.99,
  //   }
  // });

  // async findAll() {
  //   return this.prisma.course.findMany();
  // }
  async findAll(page = '1') {
    //  Math.max(..., 1): This guarantees the page number is at least 1.
    const pageNumber = Math.max(Number(page) || 1, 1);
    // Each page can contain 6 courses.
    const pageSize = 6;

    // How many records should I skip before returning results?
    const skip = (pageNumber - 1) * pageSize;

    // Instead of waiting for one and then starting the other, we can run them together: Promise.all
    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        skip,
        take: pageSize,
        // Return at most 6 courses.
      }),

      // How many courses exist in total?
      this.prisma.course.count(),
    ]);

    // Math.ceil() means: Round upward.
    const totalPages = Math.ceil(total / pageSize);

    return {
      courses,
      page: pageNumber,
      totalPages,
      total,
    };
  }

  async findById(id: number) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        lessons: true,
      },
    });

    if (!course) {
      throw new NotFoundException(`Course ${id} not found`);
    }
    return course;
  }

  async update(id: number, updateCourseDto: UpdateCourseDto) {
    await this.findById(id);
    return this.prisma.course.update({
      where: {
        id,
      },
      data: updateCourseDto,
    });
  }

  // UPDATE "Course"
  // SET price = 99.99
  // WHERE id = 1;

  async remove(id: number) {
    await this.findById(id);

    // Two ways to fix it (pick one, see docs/junior-dev-tasks.md):
    //   A) Schema-level cascade: add `onDelete: Cascade` to the relations in
    //      schema.prisma, then run a migration. The DB deletes children for you.
    //   B) App-level cleanup: delete the children first, inside a transaction so
    //      it's all-or-nothing:
    //
    //        return this.prisma.$transaction([
    //          this.prisma.lesson.deleteMany({ where: { courseId: id } }),
    //          this.prisma.enrollment.deleteMany({ where: { courseId: id } }),
    //          this.prisma.course.delete({ where: { id } }),
    //        ]);
    //

    // Delete all children before deleting the parent.
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

  // DELETE FROM "Course"
  // WHERE id = 1;

  // with cascade
  // async remove(id: number) {
  // return this.prisma.course.delete({
  //   where: {
  //     id,
  //   },
  // });
  // npx prisma migrate dev --name cascade_delete
}
