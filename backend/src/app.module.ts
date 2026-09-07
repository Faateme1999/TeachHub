import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { LessonsModule } from './lessons/lessons.module';
import { ConfigModule } from '@nestjs/config';
import { OutcomesModule } from './outcomes/outcomes.module';
import { QuestionsModule } from './missions/missions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    CoursesModule,
    EnrollmentsModule,
    LessonsModule,
    OutcomesModule,
    QuestionsModule,
    // Using isGlobal: true means every module can access ConfigService without importing ConfigModule again.
    // Create one ConfigService and make it available everywhere.
  ],
})
export class AppModule {}
