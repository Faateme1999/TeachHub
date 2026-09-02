import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { EnrollmentsModule } from 'src/enrollments/enrollments.module';
import { UsersRepository } from './user.repository';

@Module({
  imports: [PrismaModule, EnrollmentsModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
