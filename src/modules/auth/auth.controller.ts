import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RedisService } from '../../common/redis/redis.service';
import { AuthGuard } from '@nestjs/passport';
import { REDIS_KEYS } from '../../common/redis/redis.constants';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private redisService: RedisService,
  ) {}

  @Post('register')
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @Post('login')
  async login(@Body() loginAuthDto: LoginAuthDto) {
    const { access_token, refresh_token, user } =
      await this.authService.login(loginAuthDto);

    return {
      user,
      access_token,
      refresh_token,
    };
  }

  @Post('refresh')
  async refresh(@Req() req: Request) {
    const refreshToken = req.cookies?.refresh_token;

    const result = await this.authService.refreshToken(refreshToken);

    return {
      access_token: result.access_token,
      refresh_token: result.refresh_token,
    };
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout(@Req() req: any) {
    const { user } = req;

    if (!user?.jti) {
      return { message: 'Invalid token payload!' };
    }

    const redis = this.redisService.getClient();

    const ttl = Math.max((user.exp ?? 0) - Math.floor(Date.now() / 1000), 0);

    const key = REDIS_KEYS.JWT_BLACKLIST(user.jti);

    if (ttl > 0) {
      await redis.set(key, '1', { ex: ttl });
    } else {
      await redis.set(key, '1');
    }

    return { message: 'Logged out successfully!' };
  }
}
