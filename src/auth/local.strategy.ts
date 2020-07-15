import { AuthService } from './auth.service';
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from "passport-local";
import { LoginDto } from 'src/user/models/user.dto';


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {

    const user = await this.authService.validateUser({username: username, password: password});
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
