import { I18nService } from 'nestjs-i18n';

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
    private readonly i18n: I18nService,
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
      throw new NotFoundException(
        await this.i18n.translate('common.user.notFound', {
          args: { id },
        }),
      );
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

  async findUserSubmissions(userId: number) {
    return this.usersRepository.findUserSubmissions(userId);
  }

  async findUserSubmissionsForTeacher(teacherId: number, studentId: number) {
    return this.usersRepository.findUserSubmissionsForTeacher(
      teacherId,
      studentId,
    );
  }

  async remove(id: number) {
    return this.usersRepository.remove(id);
  }
}
