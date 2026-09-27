import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaService } from './prisma/prisma.service.js';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: PrismaService,
          useValue: {
            // Simulamos la estructura exacta que espera tu servicio
            usuario: {
              count: async () => 0, 
            },
          }, 
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return connection message', async () => {
      expect(await appController.getHello()).toBe('Conexión exitosa con PostgreSQL via Prisma! Usuarios registrados: 0');
    });
  });
});