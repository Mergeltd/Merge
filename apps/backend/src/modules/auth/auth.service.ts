import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto, LoginDto } from '@merge/types';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async register(dto: RegisterUserDto) {
    const passwordHash = await bcrypt.hash(dto.password, 12);
    
    // Find role ID
    const role = await this.prisma.role.findUnique({ where: { name: dto.role } });
    if (!role) throw new InternalServerErrorException('Invalid role');

    return this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        roleId: role.id,
      },
    });
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ 
        where: { email: dto.email },
        include: { role: true }
    });
    
    if (!user || !user.passwordHash || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const payload = { sub: user.id, role: user.role.name };
    return { accessToken: this.jwtService.sign(payload) };
  }
}
