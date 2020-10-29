import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { RegisterDto } from './models/auth.dto';
import { LocalAuthGuard, JwtAuthGuard } from './auth-guards';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body(ValidationPipe) body: RegisterDto) {
    return this.authService.signUp(body);
  }

/**
 * Here we use the Local Strategy for username/password lookup
 * If that is succesfull, we can sign payload for a jwt
 */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('role')
  async getRole(@Request() req) {
    return this.authService.getRole(req.user.username);
  }
}
