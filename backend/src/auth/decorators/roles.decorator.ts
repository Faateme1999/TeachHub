import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

// The metadata key we store the required roles under. RolesGuard reads it back
// using the same string. Exporting it keeps the two in sync (no magic strings).
export const ROLES_KEY = 'roles';

// @Roles(...) is a custom decorator you put on a route (or a whole controller) to
// say "only these roles may access this". It just attaches the allowed roles as
// metadata; the actual check happens in RolesGuard.
//
// Usage:
//   @UseGuards(JwtAuthGuard, RolesGuard)   // JWT first (fills req.user), then roles
//   @Roles(Role.ADMIN)
//   @Post()
//   create() { ... }
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
