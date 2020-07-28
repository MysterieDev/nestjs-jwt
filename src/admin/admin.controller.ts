import {
  Controller,
  UseGuards,
  Get,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtAuthGuard } from 'src/auth/auth-guards';

@Controller('admin')
export class AdminController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('users/all')
  async getallUsers(@Req() req) {
    const requestingUser = await this.userService.findOne(req.user.username);
    const { role, ...user } = requestingUser;
    if (role === 'ADMIN') {
      return await this.userService.findAll();
    } else {
      throw new UnauthorizedException();
    }
  }
}
