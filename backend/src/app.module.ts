import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { LessonsModule } from './lessons/lessons.module';
import { ConfigModule } from '@nestjs/config';

// TODO(junior) — housekeeping: AppController/AppService (the "GET /" and
// "GET /about" routes) are NOT registered here, so those routes don't work and
// still say "expense tracker" (leftover from a template). Either wire them up:
//   controllers: [AppController], providers: [AppService],
// (and rename the responses to TeachHub), OR delete app.controller.ts /
// app.service.ts if you don't need a health route.
@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    CoursesModule,
    EnrollmentsModule,
    LessonsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Using isGlobal: true means every module can access ConfigService without importing ConfigModule again.
    // Create one ConfigService and make it available everywhere.
  ],
})
export class AppModule {}
