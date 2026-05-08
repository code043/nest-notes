import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RedisService } from 'src/common/redis/redis.service';
import { REDIS_KEYS } from 'src/common/redis/redis.constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private redisService: RedisService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: { sub: string; role: string; jti: string }) {
    //const token = req?.headers?.authorization?.split(' ')[1];

    const redis = this.redisService.getClient();

    const isBlacklisted = await redis.get(
      REDIS_KEYS.JWT_BLACKLIST(payload.jti),
    );

    if (isBlacklisted) {
      throw new UnauthorizedException('Token revoked!');
    }

    return {
      id: payload.sub,
      role: payload.role,
      jti: payload.jti,
    };
  }
}
