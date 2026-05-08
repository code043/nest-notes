import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { NotesModule } from './modules/notes/notes.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, NotesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
