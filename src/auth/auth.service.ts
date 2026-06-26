import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { EnrollmentsService } from 'src/enrollments/enrollments.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly enrollmentsService: EnrollmentsService,
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

    // Save user
    const user = await this.usersService.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashedPassword,
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
