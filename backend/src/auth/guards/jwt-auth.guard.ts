import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // A Guard decides Can this user access this route or not?
  // already knows how to:
  // 1. Extract token
  // 2. Find JwtStrategy
  // 3. Validate token
  // 4. Put user on req.user
  // 5. Allow or deny access
}
