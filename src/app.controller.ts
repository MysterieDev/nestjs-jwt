import { Controller, Request,  Get, UseGuards, Post, Req, HttpCode, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { LocalAuthGuard, JwtAuthGuard } from './auth/auth-guards';
import { AuthService } from './auth/auth.service';
import { UserDto } from './user/models/user.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private authService: AuthService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('auth/signup')
  async signUp(@Body() body: UserDto) {
    return this.authService.signUp(body);
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req){
    return req.user
  }
}
