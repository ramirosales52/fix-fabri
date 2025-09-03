// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User, UserRole } from '../user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto' ;

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  // Registro de usuario
  async register(userData: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Convertir rol a UserRole y poner default 'estudiante'
    const rol: UserRole = userData.rol || UserRole.ESTUDIANTE;

    const user = await this.userService.create({
      ...userData,
      password: hashedPassword,
      rol,
    });

    return user;
  }

  // Login de usuario
  async login(email: string, password: string): Promise<{ access_token: string } | null> {
    const user = await this.userService.findByEmail(email);
    if (!user) return null;

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return null;

    const payload = { sub: user.id, email: user.email, rol: user.rol };
    return { access_token: this.jwtService.sign(payload) };
  }
}