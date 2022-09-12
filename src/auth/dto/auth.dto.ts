import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * Request object to register a new user to the system.
 */
export class AuthDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  password: string;
}
