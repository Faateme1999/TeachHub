import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';

import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { CreateAdminDto } from '../users/dto/create-admin.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { AuthRepository } from './auth.repository';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { createHash, randomBytes } from 'crypto';
import { EmailService } from '../email/email.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    // 1. Call findByEmail()
    // 2. Wait for the database query to finish
    // 3. Put the returned user into existingUser
    const existingUser = await this.usersService.findByEmail(
      createUserDto.email,
    );

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    // Hash password
    // bcrypt is a library used to hash passwords before storing them in the database.
    // Think of 10 as how hard bcrypt should work before producing the hash.
    // A larger number makes hashing slower. (8,10,12) Higher number = more secure but slower
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Save user.
    // IMPORTANT: public sign-up ALWAYS creates a STUDENT. We hard-code the role
    // here and never read it from the request body, so nobody can register as an
    // admin. (CreateUserDto doesn't even have a `role` field, and the global
    // ValidationPipe's forbidNonWhitelisted would 400 a stray one — this is a
    // second, explicit layer of safety.)
    const user = await this.usersService.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashedPassword,
      role: Role.STUDENT,
    });

    // object destructuring.
    // Take password out,put the remaining properties into safeUser.
    // Because you should never send a password back to the client.
    const { password, ...safeUser } = user;

    return {
      message: 'Registration successful',
      user: safeUser,
    };
  }

  // Create a new ADMIN. This is called by POST /users/admins, which is guarded so
  // ONLY an existing admin can reach it (see UsersController). The role is
  // hard-coded ADMIN here — it is never taken from the request body.

  async createAdmin(createAdminDto: CreateAdminDto) {
    // createAdminDto: This is the data coming from the HTTP request.
    const existingUser = await this.usersService.findByEmail(
      createAdminDto.email,
    );

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);

    const user = await this.usersService.create({
      name: createAdminDto.name,
      email: createAdminDto.email,
      password: hashedPassword,
      role: Role.ADMIN,
    });

    const { password, ...safeUser } = user;

    return {
      message: 'Admin created',
      user: safeUser,
    };
  }

  async login(loginDto: LoginDto) {
    // 1. Find the user
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 2. Compare passwords
    const passwordMatches = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 3. Create JWT payload
    // The information we want to put inside the token. or information about the user
    const payload = {
      // The user this token belongs to./ subject
      sub: user.id,
      email: user.email,
      // Include the role so the token is self-describing. NOTE: the RolesGuard
      // does NOT trust this claim — JwtStrategy.validate() re-fetches the user
      // from the DB, so req.user.role is always the current DB value. This is
      // here mainly so a decoded token is informative and consistent.
      role: user.role,
    };

    // 4. Generate token
    const accessToken = await this.jwtService.signAsync(payload);

    // 5. Remove password before returning
    const { password, ...safeUser } = user;

    return {
      message: 'Login successful',
      accessToken,
      user: safeUser,
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(forgotPasswordDto.email);

    if (!user) {
      return {
        message:
          'If an account with this email exists, a password reset link will be sent.',
      };
    }

    const token = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(token).digest('hex');

    //15min
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await this.authRepository.deleteUserPasswordResetTokens(user.id);

    await this.authRepository.createPasswordResetToken({
      token: tokenHash,
      userId: user.id,
      expiresAt,
    });

    const frontendUrl = this.configService.get<string>('FRONTEND_URL');

    const resetLink = `${frontendUrl}/reset-password?token=${token}`;

    await this.emailService.sendPasswordResetEmail(
      user.email,
      user.name,
      resetLink,
    );

    return {
      message:
        'If an account with this email exists, a password reset link will be sent.',
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    // Create a SHA-256 hash
    const tokenHash = createHash('sha256')
      // Add the user's reset token to the hash
      .update(resetPasswordDto.token)
      // Convert the final hash to a hexadecimal string
      .digest('hex');

    const resetToken =
      await this.authRepository.findPasswordResetToken(tokenHash);
    if (!resetToken) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    if (resetToken.expiresAt < new Date()) {
      await this.authRepository.deletePasswordResetToken(resetToken.id);
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(resetPasswordDto.password, 10);

    await this.authRepository.updateUserPassword(
      resetToken.userId,
      hashedPassword,
    );

    await this.authRepository.deletePasswordResetToken(resetToken.id);

    return {
      message: 'Password reset successful',
    };
  }
}
