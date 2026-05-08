import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { NotesModule } from './modules/notes/notes.module';
import { RedisModule } from './common/redis/redis.module';
import { CustomThrottlerModule } from './common/throttler/throttler.module';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    RedisModule,
    CustomThrottlerModule,
    PrismaModule,
    UsersModule,
    AuthModule,
    NotesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
