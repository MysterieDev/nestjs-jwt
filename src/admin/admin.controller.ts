import {
  Controller,
  UseGuards,
  Get,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtAuthGuard } from 'src/auth/auth-guards';
import { Role } from 'src/user/models/user.entity';

@Controller('admin')
export class AdminController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('users/all')
  async getallUsers(@Req() req) {
    const requestingUser = await this.userService.findOneAndCheckRole(req.user.username, Role.Admin);
    if (requestingUser) {
      return await this.userService.findAllWithRole(Role.User);
  }
}

@UseGuards(JwtAuthGuard)
@Get('admins/all')
async getAllAdmins(@Req() req) {
  const requestingUser = await this.userService.findOneAndCheckRole(req.user.username, Role.Admin);
  if (requestingUser) {
    return await this.userService.findAllWithRole(Role.Admin);
}
}
}
