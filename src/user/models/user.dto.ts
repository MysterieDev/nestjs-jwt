import { Role } from './user.entity';

export interface UserDto {
  username: string;
  email: string;
  password: string;
  role?: Role;
}
