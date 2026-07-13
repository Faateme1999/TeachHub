import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { EnrollmentsModule } from 'src/enrollments/enrollments.module';

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
    JwtModule.register({
      secret: 'my-super-secret-key',
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
