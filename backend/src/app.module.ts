import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaService } from './prisma/prisma.service.js';
import { AuthModule } from './auth/auth.module.js';
import { VocabularioModule } from './juegos/vocabulario.module.js';

@Module({
  imports: [AuthModule, VocabularioModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
