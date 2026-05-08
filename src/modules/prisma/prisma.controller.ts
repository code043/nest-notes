import { Controller, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Controller('prisma')
export class PrismaController extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
