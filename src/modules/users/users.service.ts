import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(user: any) {
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Access denied!');
    }

    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        role: true,
      },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(userId: string, user: any) {
    if (user.role !== 'ADMIN' && user.id !== userId) {
      throw new ForbiddenException('Access denied!');
    }

    const foundUser = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        role: true,
        notes: true,
      },
    });

    if (!foundUser) {
      throw new NotFoundException('User not found!');
    }

    return foundUser;
  }

  async remove(userId: string, user: any) {
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Only admin can delete users!');
    }

    const result = await this.prisma.user.deleteMany({
      where: { id: userId },
    });

    if (result.count === 0) {
      throw new NotFoundException('User not found!');
    }

    return {
      message: 'User deleted successfully!',
      deletedId: userId,
    };
  }
}
