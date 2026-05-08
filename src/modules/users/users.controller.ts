import { Controller, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { User } from '../auth/decorators/user.decorator';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@User() user: any) {
    return this.usersService.findAll(user);
  }

  @Get(':userId')
  findOne(@Param('userId') userId: string, @User() user: any) {
    return this.usersService.findOne(userId, user);
  }

  @Delete(':userId')
  async remove(@Param('userId') userId: string, @User() user: any) {
    return await this.usersService.remove(userId, user);
  }
}
