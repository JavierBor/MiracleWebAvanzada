import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { VocabularioModule } from './juegos/vocabulario.module.js';
import { ForoModule } from './foro/foro.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { MailModule } from './mail/mail.module.js';
import { AdminController } from './admin/admin.controller.js';
import { AdminService } from './admin/admin.service.js';
import { RateLimitGuard } from './common/guards/rate-limit.guard.js';

@Module({
  imports: [AuthModule, VocabularioModule, ForoModule, PrismaModule, MailModule],
  controllers: [AppController, AdminController],
  providers: [
    AppService,
    AdminService,
    {
      provide: APP_GUARD,
      useClass: RateLimitGuard,
    },
  ],
})
export class AppModule {}