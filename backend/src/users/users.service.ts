import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserData } from './types/create-user.type';
import { EnrollmentsService } from 'src/enrollments/enrollments.service';
import { Role } from '@prisma/client';

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
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        // role is REQUIRED here: JwtStrategy.validate() returns this object as
        // `req.user`, and RolesGuard reads `req.user.role`. If you remove `role`
        // from this select, the guard sees `undefined` and admin checks break.
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return user;
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        // Expose role so the frontend can show/hide admin-only UI in user lists.
        role: true,
        createdAt: true,
      },
    });
  }

  // async findAll() {
  //   const users = await this.prisma.user.findMany();

  //   return users.map(({ password, ...user }) => user);
  // }

  async findUserCourses(userId: number) {
    await this.findById(userId);
    return this.enrollmentsService.findUserCourses(userId);
  }

  async findCoursesByUserId(userId: number) {
    await this.findById(userId);
    return this.enrollmentsService.findUserCourses(userId);
  }

  async updateRole(id: number, role: Role) {
    await this.findById(id);
    return this.prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }
}
