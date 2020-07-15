import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { RegisterDto } from './models/auth.dto';
import { LocalAuthGuard } from './auth-guards';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('auth/signup')
  async signUp(@Body(ValidationPipe) body: RegisterDto) {
    return this.authService.signUp(body);
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
