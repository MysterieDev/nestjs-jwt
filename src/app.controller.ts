import {
  Controller,
  Request,
  Get,
  UseGuards,
  Post,
  Body,
  ValidationPipe,
} from '@nestjs/common';
import { AppService } from './app.service';
import { LocalAuthGuard, JwtAuthGuard } from './auth/auth-guards';
import { AuthService } from './auth/auth.service';
import { RegisterDto } from './auth/models/auth.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
