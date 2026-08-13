import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

// This file creates a custom @Roles() decorator for your NestJS authorization system.
// @Roles(...) does not check permissions itself.
// It only stores information saying which roles are allowed.
// RolesGuard later reads that information and performs the actual check.

// The metadata key we store the required roles under. RolesGuard reads it back
// using the same string. Exporting it keeps the two in sync (no magic strings).
export const ROLES_KEY = 'roles';
// we're going to store our metadata under this key.

// @Roles(...) is a custom decorator you put on a route (or a whole controller) to
// say "only these roles may access this". It just attaches the allowed roles as
// metadata; the actual check happens in RolesGuard.
//
// Usage:
//   @UseGuards(JwtAuthGuard, RolesGuard)   // JWT first (fills req.user), then roles
//   @Roles(Role.ADMIN)
//   @Post()
//   create() { ... }
// SetMetadata() is a NestJS function used to attach metadata to a class or method.
// Think of metadata as a small piece of information attached to a route.

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
// SetMetadata('roles', [Role.ADMIN]), means: Store [Role.ADMIN] as metadata under the key "roles".
// This is safer because your RolesGuard will also use the same key.
// The ... is the rest operator. It means the decorator can accept one or more roles.
// collects all the arguments into an array:
// @Roles(Role.ADMIN, Role.TEACHER) => roles = [Role.ADMIN, Role.TEACHER]
