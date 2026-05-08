import { ConflictException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async register(createAuthDto: CreateAuthDto) {
    const { email } = createAuthDto;
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email already existis!');
    }
    return await this.prisma.user.create({
      data: createAuthDto,
    });
  }

  async login() {
    return 'login';
  }
}
