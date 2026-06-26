import { Injectable } from '@nestjs/common';
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
}
