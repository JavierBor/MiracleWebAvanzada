
import { Test, TestingModule } from '@nestjs/testing';
import { ForoController } from './foro.controller.js';
import { ForoService } from './foro.service.js';

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
    }).compile();

    controller = module.get<ForoController>(ForoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
