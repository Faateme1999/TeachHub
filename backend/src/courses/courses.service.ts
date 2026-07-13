import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

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
    return this.prisma.course.findUnique({
      where: {
        id,
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

  // UPDATE "Course"
  // SET price = 99.99
  // WHERE id = 1;

  async remove(id: number) {
    return this.prisma.course.delete({
      where: {
        id,
      },
    });
  }

  // DELETE FROM "Course"
  // WHERE id = 1;
}
