import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CoursesRepository } from './courses.repository';

@Injectable()
export class CoursesService {
  constructor(private readonly coursesRepository: CoursesRepository) {}

  async create(createCourseDto: CreateCourseDto) {
    return this.coursesRepository.create(createCourseDto);
  }

  // Because Prisma's create() method is defined to expect an object with a property called data.
  // prisma.course.create({
  //   data: {
  //     title: 'NestJS',
  //     description: '...',
  //     price: 49.99,
  //   }
  // });

  async findAll(page = '1') {
    //  Math.max(..., 1): This guarantees the page number is at least 1.
    const pageNumber = Math.max(Number(page) || 1, 1);
    // Each page can contain 6 courses.
    const pageSize = 6;

    // How many records should I skip before returning results?
    const skip = (pageNumber - 1) * pageSize;
    // skip = (3-1)*6=12

    // Instead of waiting for one and then starting the other, we can run them together: Promise.all
    const [courses, total] = await Promise.all([
      this.coursesRepository.findAll(skip, pageSize),

      // How many courses exist in total?
      this.coursesRepository.count(),
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
    const course = await this.coursesRepository.findById(id);

    if (!course) {
      throw new NotFoundException(`Course ${id} not found`);
    }

    return course;
  }

  async update(id: number, updateCourseDto: UpdateCourseDto) {
    await this.findById(id);

    return this.coursesRepository.update(id, updateCourseDto);
  }

  // UPDATE "Course"
  // SET price = 99.99
  // WHERE id = 1;

  async remove(id: number) {
    await this.findById(id);

    // Delete all children before deleting the parent.
    return this.coursesRepository.deleteCourseWithChildren(id);
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
