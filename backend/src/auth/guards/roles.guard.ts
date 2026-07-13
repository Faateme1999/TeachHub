import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';

import { ROLES_KEY } from '../decorators/roles.decorator';

// RolesGuard checks that the logged-in user has one of the roles required by the
// @Roles(...) decorator on a route.
//
// IMPORTANT — guard ORDER matters. Always list it AFTER JwtAuthGuard:
//   @UseGuards(JwtAuthGuard, RolesGuard)
// JwtAuthGuard runs first and puts the user on `req.user` (including `role`,
// because users.service.ts findById selects it). RolesGuard then reads that role.
//
// Reflector is Nest's helper for reading metadata that decorators set. It's
// available everywhere — this guard needs NO extra module wiring.
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Read the roles required by @Roles(...) — checks the handler (method)
    //    first, then the controller class. If no @Roles is present, requiredRoles
    //    is undefined and the route is open to any authenticated user.
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // TODO(junior) — US-034 (roles guard): finish this method. Steps:
    //   1. If `requiredRoles` is undefined/empty, return true (no role required).
    //   2. Get the request:  const { user } = context.switchToHttp().getRequest();
    //   3. Allow the request only if the user's role is in requiredRoles, e.g.
    //        if (user && requiredRoles.includes(user.role)) return true;
    //   4. Otherwise reject:  throw new ForbiddenException('Admins only');
    //
    // Until you implement it, this guard DENIES every guarded route so we don't
    // accidentally ship an admin route that lets everyone in. Replace the throw
    // below with the real logic above.
    void requiredRoles; // (silences "unused var" until you use it — delete this line)
    void ForbiddenException; // (imported for you to use in step 4 — delete this line)
    throw new ForbiddenException(
      'TODO(junior): RolesGuard is not implemented yet — see roles.guard.ts',
    );
  }
}
