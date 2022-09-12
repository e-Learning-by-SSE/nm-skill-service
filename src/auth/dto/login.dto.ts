import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * Query data to log a user into the system.
 */
export class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
