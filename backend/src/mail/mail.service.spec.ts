import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          // Simulamos el PrismaService para el test
          provide: PrismaService,
          useValue: {
            usuario: {
              findMany: () => Promise.resolve([]),
            },
          },
        },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});