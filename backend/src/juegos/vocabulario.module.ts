import { Module } from '@nestjs/common';
import { VocabularioService } from './vocabulario.service.js';
import { VocabularioController } from './vocabulario.controller.js';
import { AdaptativoService } from './adaptativo.service.js';
import { AdaptativoController } from './adaptativo.controller.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Module({
  controllers: [VocabularioController, AdaptativoController],
  providers: [VocabularioService, AdaptativoService, PrismaService],
  exports: [VocabularioService, AdaptativoService],
})
export class VocabularioModule {}