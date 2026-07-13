import {
  BadRequestException,
  Injectable,
  NotImplementedException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';

import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { CreateAdminDto } from '../users/dto/create-admin.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
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
  //
  // TODO(junior) — US-035 (create admin): implement this method. It's almost
  // identical to register() above:
  //   1. Reject if the email already exists (usersService.findByEmail → 400).
  //   2. Hash the password with bcrypt (same as register: bcrypt.hash(pw, 10)).
  //   3. Create the user with role: Role.ADMIN.
  //   4. Strip the password and return { message, user: safeUser }.
  // Delete the throw below once you've written it.
  async createAdmin(createAdminDto: CreateAdminDto) {
    void createAdminDto; // (unused until you implement — delete this line)
    throw new NotImplementedException(
      'TODO(junior): implement createAdmin — see auth.service.ts',
    );
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
}
