import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  async findOne(userId: string) {
    return await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        notes: true,
      },
    });
  }
  async remove(userId: string) {
    await this.prisma.user.delete({
      where: { id: userId },
    });
    return { message: 'User has deleted!' };
  }
}
