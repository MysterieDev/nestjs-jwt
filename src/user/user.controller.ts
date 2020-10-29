import {
  Controller,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/auth-guards';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('info')
  async getHello(@Req() req) {
    return await this.userService.findOneAndGetSafe(req.user.username);
  }
}
