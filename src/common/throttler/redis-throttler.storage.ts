import { ThrottlerStorage } from '@nestjs/throttler';
import { ThrottlerStorageRecord } from '@nestjs/throttler/dist/throttler-storage-record.interface';
import Redis from 'ioredis';
import { REDIS_KEYS } from '../redis/redis.constants';

export class RedisThrottlerStorage implements ThrottlerStorage {
  constructor(private redis: Redis) {}

  async increment(
    key: string,
    ttl: number,
    limit: number,
    blockDuration: number,
    throttlerName: string,
  ): Promise<ThrottlerStorageRecord> {
    // const now = Date.now();

    const hitsKey = `${REDIS_KEYS.THROTTLE}:${throttlerName}:${key}`;
    const blockKey = `${REDIS_KEYS.THROTTLE_BLOCK}:${throttlerName}:${key}`;

    const isBlocked = await this.redis.exists(blockKey);

    if (isBlocked) {
      const timeToBlockExpire = await this.redis.ttl(blockKey);

      return {
        totalHits: limit + 1,
        timeToExpire: 0,
        isBlocked: true,
        timeToBlockExpire,
      };
    }

    const totalHits = await this.redis.incr(hitsKey);

    if (totalHits === 1) {
      await this.redis.expire(hitsKey, ttl);
    }

    const timeToExpire = await this.redis.ttl(hitsKey);

    if (totalHits > limit) {
      await this.redis.set(blockKey, '1', 'EX', blockDuration);

      return {
        totalHits,
        timeToExpire,
        isBlocked: true,
        timeToBlockExpire: blockDuration,
      };
    }

    return {
      totalHits,
      timeToExpire,
      isBlocked: false,
      timeToBlockExpire: 0,
    };
  }
}
