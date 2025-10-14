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
  async login(@Body() body: { email?: string; legajo?: string; password: string }) {
    if (!body.password) {
      return { error: 'La contraseña es requerida' };
    }
    
    const identifier = body.email || body.legajo;
    if (!identifier) {
      return { error: 'Se requiere email o legajo' };
    }
    
    try {
      const result = await this.authService.login(identifier, body.password);
      if (!result) {
        return { error: 'Credenciales inválidas' };
      }
      return result;
    } catch (error) {
      return { 
        error: error.message || 'Error al iniciar sesión',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      };
    }
  }

  // 🔒 Endpoint protegido
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
