import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { RedisService } from '../redis/redis.service';
import { RedisThrottlerStorage } from './redis-throttler.storage';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      inject: [RedisService],
      useFactory: (redisService: RedisService) => ({
        storage: new RedisThrottlerStorage(redisService.getClient()),
        throttlers: [
          {
            ttl: 60,
            limit: 10,
          },
        ],
      }),
    }),
  ],
  exports: [ThrottlerModule],
})
export class CustomThrottlerModule {}
