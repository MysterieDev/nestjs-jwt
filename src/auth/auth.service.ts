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
/**
 * This service provides Basic Authentication Utilities.
 * This App uses a combination of the Local and the JWT Passport Strategies
 * First, we use a Local Strategy to look up the User in the database, then
 * we sign the jwt token and verify it. The secret and the expiration is defined in the module
 */
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

  /**
   * Needed for the Local Passport Strategy
   * Checks for the user in the database
   * @param loginData the DTO for the Login data consisting of username and password
   */
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

  /**
   * Signs the payload for the JWT
   * @param user the req user object
   */
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
    // Every user has its salt saved in the database
    // This is save as its encrypted with bcrypt
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
