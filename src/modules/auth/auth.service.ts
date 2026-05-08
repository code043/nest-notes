import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';

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

  async login(loginAuthDto: LoginAuthDto) {
    const { password, email } = loginAuthDto;
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    const pass = bcrypt.compareSync(password, user.password);
    if (!pass) {
      throw new UnauthorizedException('Invalid credentials!');
    }

    return { user };
  }
}
