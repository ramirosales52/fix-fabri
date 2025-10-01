// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User, UserRole } from '../user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  // Registro de usuario
  async register(userData: CreateUserDto): Promise<User> {
    // Verificar que la contraseña exista
    if (!userData.password) {
      throw new Error('La contraseña es obligatoria');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Convertir rol a UserRole y poner default 'estudiante'
    const rol: UserRole = userData.rol || UserRole.ESTUDIANTE;

    // Crear el usuario con la contraseña hasheada
    const user = await this.userService.create({
      ...userData,
      password: hashedPassword,
      rol,
    });

    return user;
  }

  // Login de usuario
  async login(identifier: string, password: string): Promise<{ access_token: string; user: Partial<User> } | null> {
    // Buscar usuario por legajo primero y luego por email como fallback
    let user = await this.userService.findByLegajo(identifier);
    if (!user) {
      user = await this.userService.findByEmail(identifier);
    }
    if (!user) return null;

    // Verificar contraseña
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return null;

    // Generar token JWT
    const payload = { 
      sub: user.id, 
      email: user.email, 
      rol: user.rol,
      legajo: user.legajo
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        legajo: user.legajo,
        rol: user.rol,
      },
    };
  }
}