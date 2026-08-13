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
  // CanActivate tells TypeScript:"This class is a Guard."
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Read the roles required by @Roles(...) — checks the handler (method)
    //    first, then the controller class. If no @Roles is present, requiredRoles
    //    is undefined and the route is open to any authenticated user.
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [ 
      // That decorator stores metadata using a key.
      // The Reflector needs that key to know which metadata to read.
      context.getHandler(),
      // همین تابعی که الان قرار است اجرا شود.
      // متد از کلاس نزدیک‌تر است یا اولویت بیشتری دارد.
      context.getClass(),
      // تابع داخل چه کلاسی است؟
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
      // return true means: "The guard allows the request to continue."
    }

    const { user } = context.switchToHttp().getRequest();
    // Think of context as a box containing information about the current request./ "Information about the current execution."
    // .switchToHttp(): "I'm handling an HTTP request, so give me the HTTP context."/ you're saying:"Go to the HTTP branch."
    // .getRequest():"Give me the Express request object."/ This is the same req you've already seen in controllers.
    // Now you have access to: user.role

    if (user && requiredRoles.includes(user.role)) {
      return true;
    }

    throw new ForbiddenException('Admins only');

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
  }
}
