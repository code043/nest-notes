import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async register(createAuthDto: CreateAuthDto) {
    return await this.prisma.user.create({
      data: createAuthDto,
    });
  }

  async login() {
    return 'login';
  }
}
