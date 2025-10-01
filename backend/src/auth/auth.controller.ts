// src/auth/auth.controller.ts
import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CreateUserDto } from '../user/dto/create-user.dto'; // ✅ Importa el DTO

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) { // ✅ Usa el DTO aquí
    return this.authService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() body: { legajo: string; password: string }) {
    const token = await this.authService.login(body.legajo, body.password);
    if (!token) return { error: 'Credenciales inválidas' };
    return token;
  }

  // 🔒 Endpoint protegido
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
