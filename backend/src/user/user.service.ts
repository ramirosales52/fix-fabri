// src/user/user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PlanEstudioService } from '../plan-estudio/plan-estudio.service'; // ✅ Importa el servicio

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository, // ✅ Sin declaración de tipo
    private planEstudioService: PlanEstudioService,
  ) {}

  async create(userData: CreateUserDto): Promise<User> {
    let planEstudio;
    if (userData.planEstudioId) {
      planEstudio = await this.planEstudioService.findOne(userData.planEstudioId);
    }
    
    const { planEstudioId, ...rest } = userData;
    const user = this.userRepository.create({
      ...rest,
      ...(planEstudio ? { planEstudio } : {}),
    });
    
    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ 
      where: { email }, 
      relations: ['planEstudio'] 
    });
    return user ?? undefined;
  }

  async findByLegajo(legajo: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({
      where: { legajo },
      relations: ['planEstudio'],
    });
    return user ?? undefined;
  }

  async findById(id: number): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ 
      where: { id }, 
      relations: ['planEstudio'] 
    });
    return user ?? undefined;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: ['planEstudio'] });
  }

  async update(id: number, updateData: UpdateUserDto): Promise<User | undefined> {
    let planEstudio;
    if (updateData.planEstudioId) {
      planEstudio = await this.planEstudioService.findOne(updateData.planEstudioId);
    }
    
    const { planEstudioId, ...rest } = updateData;
    await this.userRepository.update(id, {
      ...rest,
      ...(planEstudio ? { planEstudio } : {}),
    });
    
    return this.findById(id);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}