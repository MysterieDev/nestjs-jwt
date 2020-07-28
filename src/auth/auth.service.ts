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
import { SQL_ERROR } from 'src/utils/error-codes';
import * as bcrypt from 'bcrypt';
import { LoginDto, RegisterDto } from './models/auth.dto';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async getRole(username: string) {
    const user = await this.userService.findOne(username);
    if (user) {
      return { role: user.role };
    } else {
      throw new NotFoundException();
    }
  }

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
        throw new UnauthorizedException('Invalid Login Credentials');
      }
    } else {
      throw new NotFoundException();
    }
  }

  async login(user: User) {
    const payload = { username: user.username, id: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      expiresIn: 1800,
    };
  }

  async signUp(user: RegisterDto) {
    console.log(user);

    const { username, email, password } = user;
    const newUser = new User();
    const salt = await bcrypt.genSalt();
    newUser.username = username;
    newUser.salt = salt;
    newUser.password = await this.hashPassword(password, salt);
    newUser.email = email;
    newUser.role = Role.User;

    try {
      let user = await this.userService.insertOne(newUser);
      const { password, salt, role, id, ...result } = user;
      return result;
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
