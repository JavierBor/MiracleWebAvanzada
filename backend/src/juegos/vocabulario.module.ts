import { Module } from '@nestjs/common';
import { VocabularioService } from './vocabulario.service.js';
import { VocabularioController } from './vocabulario.controller.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Module({
  controllers: [VocabularioController],
  providers: [VocabularioService, PrismaService],
  exports: [VocabularioService],
})
export class VocabularioModule {}