import { UserService } from './../user/user.service';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, Role } from 'src/user/models/user.entity';
import { UserDto } from 'src/user/models/user.dto';
import { SQL_ERROR } from 'src/utils/error-codes';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './models/auth.dto';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(loginData: LoginDto): Promise<any> {
    const user = await this.userService.findOne(loginData.username);
    if (user) {
      const hashedPassword = await this.hashPassword(
        loginData.password,
        user.salt,
      );
      if (user && user.password === hashedPassword) {
        const { password, salt, ...result } = user;
        return result;
      } else {
        return null;
      }
    } else {
      throw new NotFoundException();
    }
  }

  async login(user: User) {
    const payload = { username: user.username, id: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signUp(user: UserDto) {
    const { username, email, password } = user;
    const newUser = new User();
    const salt = await bcrypt.genSalt();
    newUser.username = username;
    newUser.salt = salt;
    newUser.password = await this.hashPassword(password, salt);
    console.log(newUser.password);
    newUser.email = email;
    newUser.role = Role.User;

    try {
      const user = await this.userService.insertOne(newUser);
      return user;
    } catch (e) {
      if (e.code === SQL_ERROR.DUPLICATE) {
        throw new ConflictException('User or Email already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }

    return;
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
