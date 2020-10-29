import {
  Controller,
  Get,
  UseGuards,
  Req,
  Patch,
  ValidationPipe,
  Body,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/auth-guards';
import { UpdateUserDataDto } from '../auth/models/auth.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('info')
  async getUserInfo(@Req() req) {
    return await this.userService.findOneAndGetSafe(req.user.username);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update')
  async updateUserInfo(
    @Req() req,
    @Body(ValidationPipe) body: UpdateUserDataDto,
  ) {
    return await this.userService.updateUser(req.user.username, body);
  }
}
