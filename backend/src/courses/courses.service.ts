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

  async findAll() {
    return this.prisma.course.findMany();
  }

  async findById(id: number) {
    // TODO(junior) — US-016: include the course's lessons in the response.
    // Right now this returns only the course row. The features doc says the
    // course detail page should also show its lessons. Prisma can fetch the
    // related lessons in the SAME query using `include`:
    //
    //   return this.prisma.course.findUnique({
    //     where: { id },
    //     include: { lessons: true }, // <-- adds a `lessons: [...]` array
    //   });
    //
    // (The frontend currently fetches lessons via GET /courses/:courseId/lessons,
    //  so this is an optional improvement — but a good one to learn `include`.)

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
    // TODO(junior) — US-014: handle deleting a course that has lessons/enrollments.
    // Problem: the database uses "ON DELETE RESTRICT", so if this course still has
    // lessons or enrollments, this delete throws a foreign-key error (→ 500).
    //
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
    // Bonus: throw a NotFoundException if the course id doesn't exist (see below).

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

  // TODO(junior) — friendlier errors (applies to findById/update/remove):
  // When an id doesn't exist, Prisma either returns `null` (findUnique) or throws
  // a raw error (update/delete). Prefer a clear 404 for the client, e.g.:
  //
  //   import { NotFoundException } from '@nestjs/common';
  //   const course = await this.prisma.course.findUnique({ where: { id } });
  //   if (!course) throw new NotFoundException(`Course ${id} not found`);
  //   return course;

  // with cascade
  // async remove(id: number) {
  // return this.prisma.course.delete({
  //   where: {
  //     id,
  //   },
  // });
  // npx prisma migrate dev --name cascade_delete
}
