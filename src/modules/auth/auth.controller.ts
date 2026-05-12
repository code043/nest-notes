import { Controller, Post, Body, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Response, Request } from 'express';
import { RedisService } from '../../common/redis/redis.service';
import { AuthGuard } from '@nestjs/passport';
import { REDIS_KEYS } from '../../common/redis/redis.constants';
const isProd = process.env.NODE_ENV === 'production';

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
  async login(
    @Body() loginAuthDto: LoginAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token, user } =
      await this.authService.login(loginAuthDto);

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'none',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      user,
      access_token,
    };
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refresh_token;

    const result = await this.authService.refreshToken(refreshToken);

    res.cookie('refresh_token', result.refresh_token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'none',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      access_token: result.access_token,
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
