import { IsEmail, IsString, MinLength } from 'class-validator';

// Used for incoming HTTP requests.
// The DTO validates what the client sends.

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}
