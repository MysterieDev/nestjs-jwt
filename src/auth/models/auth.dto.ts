import {
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
  Matches,
} from 'class-validator';
import { Role } from 'src/user/models/user.entity';
export interface LoginDto {
  username: string;
  password: string;
}

export class RegisterDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;
  @IsEmail()
  email: string;
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak',
  })
  password: string;
  role?: Role;
}
