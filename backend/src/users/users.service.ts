import { Injectable, NotImplementedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserData } from './types/create-user.type';
import { EnrollmentsService } from 'src/enrollments/enrollments.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly enrollmentsService: EnrollmentsService,
  ) {}

  async create(data: CreateUserData) {
    // This Prisma call inserts a new user into the database.
    // INSERT INTO users (...)
    // VALUES (...);
    return this.prisma.user.create({
      data,
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  // async findById(id: number) {
  //   return this.prisma.user.findUnique({
  //     where: {
  //       id,
  //     },
  //   });
  // }
  async findById(id: number) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });
  }

  // async findAll() {
  //   const users = await this.prisma.user.findMany();

  //   return users.map(({ password, ...user }) => user);
  // }

  async findUserCourses(userId: number) {
    return this.enrollmentsService.findUserCourses(userId);
  }

  // TODO(junior) — US-028: return the courses that ANY user (by id) is enrolled in.
  // This is a STUB. It currently throws 501 (Not Implemented) so the app doesn't
  // pretend to work. The good news: the logic already exists! `findUserCourses`
  // right above uses `enrollmentsService.findUserCourses(...)`, which does exactly
  // what we need — it just takes a userId. So finishing this is a one-liner:
  //
  //   1. Delete the `throw` line below.
  //   2. Uncomment the return line.
  //   3. (Optional) first check the user exists and throw NotFoundException if not.
  //
  // Verify: `GET /users/1/courses` should return an array of that user's courses
  //         (instead of a 501 error).
  async findCoursesByUserId(userId: number) {
    throw new NotImplementedException(
      'TODO(junior): implement findCoursesByUserId — see the comment above.',
    );
    // return this.enrollmentsService.findUserCourses(userId);
  }
}
