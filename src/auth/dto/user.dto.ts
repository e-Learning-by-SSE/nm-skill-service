import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * Response object to represent users of the system.
 * This is not limited to the current user.
 */
export class UserDto {
  @IsNotEmpty()
  id: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;
}
