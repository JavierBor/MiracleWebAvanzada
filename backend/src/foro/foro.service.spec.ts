
import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../prisma/prisma.service.js';
import { ForoService } from './foro.service.js';

describe('ForoService', () => {
  let service: ForoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ForoService,
        {
          provide: PrismaService,
          useValue: {},
        },
        {
          provide: HttpService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ForoService>(ForoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
