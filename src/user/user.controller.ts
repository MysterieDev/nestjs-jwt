import {
  Controller,
  Get,
  Param,
  UseGuards,
  Header,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/auth-guards';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('info')
  async getHello(@Req() req) {
    const user = await this.userService.findOne(req.user.username);

    const { password, salt, id, ...result } = user;
    return result;
  }
}
