import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ForoService } from './foro.service.js';
import { ForoController } from './foro.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js'; // Ajusta la ruta a tu módulo de Prisma si es distinta

@Module({
  imports: [HttpModule, PrismaModule], // <-- HttpModule es obligatorio para hablar con FastAPI
  controllers: [ForoController],
  providers: [ForoService],
})
export class ForoModule {}