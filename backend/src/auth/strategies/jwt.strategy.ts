import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
// Passport is a library that helps NestJS handle authentication.
// Passport = authentication helper
export class JwtStrategy extends PassportStrategy(Strategy) {
  // A strategy defines: How do we authenticate the user?
  // The guard asks the strategy to verify the user.
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    // it must initialize the parent class. (by super)
    super({
      // "Where should I look for the JWT token?"
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Should expired tokens still work?
      ignoreExpiration: false,
      // It's the secret password used to sign and verify JWT tokens
      // Think of it as a password that only the server knows.
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;

    // The returned user is attached to the request.
    // req.user = safeUser;

    // if in usersService.findById we had password:
    // const { password, ...safeUser } = user;

    // return safeUser;
    // after this, Passport automatically does:req.user = safeUser;
    // Now the request object looks like:
    // req = {
    //   headers: {...},
    //   body: {...},
    //   user: {
    //     id: "123",
    //     name: "John",
    //     email: "john@test.com"
    //   }
    // }
  }
}
