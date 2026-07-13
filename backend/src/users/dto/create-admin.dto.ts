import { IsEmail, IsString, MinLength } from 'class-validator';

// Body shape for POST /users/admins (admin-creates-admin).
//
// Deliberately the SAME fields as CreateUserDto — name, email, password — and NO
// `role` field. The role is hard-coded to ADMIN in the service, so the caller
// cannot choose it. (A separate DTO also keeps the public register endpoint and
// the admin-create endpoint clearly distinct.)
export class CreateAdminDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}
