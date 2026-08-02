import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { EnrollmentsModule } from 'src/enrollments/enrollments.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    EnrollmentsModule,
    // TODO(junior) — security: this secret is hardcoded here AND in
    // strategies/jwt.strategy.ts. A real app keeps secrets out of the code and
    // reads them from an environment variable. Steps to learn:
    //   1. Add JWT_SECRET=... to backend/.env
    //   2. Import ConfigModule (already installed: @nestjs/config) in AppModule.
    //   3. Use JwtModule.registerAsync + ConfigService to read process.env.JWT_SECRET.
    //   4. Read the same value in jwt.strategy.ts. (Both MUST match or tokens break.)

    // because the configuration depends on another service
    // The word Async here really means:"Before registering this module, I need to execute some code." / "Don't register immediately. First execute the configuration function."
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '1d',
          // "Any token you create should expire after 1 day."
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
