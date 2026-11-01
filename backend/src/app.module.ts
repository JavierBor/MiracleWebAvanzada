import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaService } from './prisma/prisma.service.js';
import { AuthModule } from './auth/auth.module.js';
import { VocabularioModule } from './juegos/vocabulario.module.js';
import { ForoModule } from './foro/foro.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { MailModule } from './mail/mail.module.js';

// 1. Importar el controlador y el servicio de Admin
import { AdminController } from './admin/admin.controller.js';
import { AdminService } from './admin/admin.service.js';

@Module({
  imports: [AuthModule, VocabularioModule, ForoModule, PrismaModule, MailModule],
  controllers: [
    AppController,
    AdminController
  ],
  providers: [
    AppService, 
    PrismaService, 
    AdminService
  ],
})
export class AppModule {}