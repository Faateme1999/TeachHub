import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserData } from './types/create-user.type';
import { EnrollmentsService } from 'src/enrollments/enrollments.service';
import { Role } from '@prisma/client';
import { UsersRepository } from './user.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly enrollmentsService: EnrollmentsService,
  ) {}

  async create(data: CreateUserData) {
    return this.usersRepository.create(data);
  }

  async findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  async findById(id: number) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return user;
  }

  async findAll() {
    return this.usersRepository.findAll();
  }

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

    return this.usersRepository.updateRole(id, role);
  }
}
