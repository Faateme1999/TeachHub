import { Role } from '@prisma/client';

// Used inside your application when creating a user.
//
// `role` is OPTIONAL here: if a caller omits it, Prisma falls back to the schema
// default (STUDENT). Self sign-up leaves it unset (→ STUDENT); the create-admin
// flow passes `role: Role.ADMIN` explicitly. The role is NEVER read from a
// request body — see auth.service.ts / the CreateAdminDto for why.
export type CreateUserData = {
  name: string;
  email: string;
  password: string;
  role?: Role;
};
