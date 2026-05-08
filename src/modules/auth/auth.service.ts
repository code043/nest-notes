import { ConflictException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private salt = 10;
  constructor(private prisma: PrismaService) {}
  async register(createAuthDto: CreateAuthDto) {
    const { password, email } = createAuthDto;
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email already existis!');
    }
    const hashedPassword = bcrypt.hashSync(password, this.salt);
    return await this.prisma.user.create({
      data: {
        ...createAuthDto,
        password: hashedPassword,
      },
    });
  }

  async login() {
    return 'login';
  }
}
