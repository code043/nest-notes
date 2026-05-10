import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RedisService } from '../../../common/redis/redis.service';
import { REDIS_KEYS } from '../../../common/redis/redis.constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private redis;

  constructor(private redisService: RedisService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    });

    this.redis = this.redisService.getClient();
  }

  async validate(payload: { sub: string; jti: string }) {
    const isBlacklisted = await this.redis.get(
      REDIS_KEYS.JWT_BLACKLIST(payload.jti),
    );

    if (isBlacklisted) {
      throw new UnauthorizedException('Token revoked!');
    }

    return {
      id: payload.sub,
      jti: payload.jti,
    };
  }
}
