import { IsNotEmpty } from 'class-validator';

import { UserDto } from './user.dto';

/**
 * Acknowledgement of a successful login attempt.
 */
export class LoginAckDto extends UserDto {
  @IsNotEmpty()
  access_token: string;
}
