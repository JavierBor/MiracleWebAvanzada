
import { Test, TestingModule } from '@nestjs/testing';
import { ForoController } from './foro.controller.js';
import { ForoService } from './foro.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

describe('ForoController', () => {
  let controller: ForoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ForoController],
      providers: [
        {
          provide: ForoService,
          useValue: {},
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ForoController>(ForoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
