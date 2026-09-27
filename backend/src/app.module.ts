import {
  I18nModule,
  AcceptLanguageResolver,
  QueryResolver,
  HeaderResolver,
} from 'nestjs-i18n';
import * as path from 'path';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { LessonsModule } from './lessons/lessons.module';
import { ConfigModule } from '@nestjs/config';
import { OutcomesModule } from './outcomes/outcomes.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { AiModule } from './ai/ai.module';
import { MissionsModule } from './missions/missions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, 'i18n'),
        watch: true,
      },
      resolvers: [new HeaderResolver(['x-lang'])],
    }),

    PrismaModule,
    UsersModule,
    AuthModule,
    CoursesModule,
    EnrollmentsModule,
    LessonsModule,
    OutcomesModule,
    MissionsModule,
    AssignmentsModule,
    AiModule,
    // Using isGlobal: true means every module can access ConfigService without importing ConfigModule again.
    // Create one ConfigService and make it available everywhere.
  ],
})
export class AppModule {}
