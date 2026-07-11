import { Test, TestingModule } from '@nestjs/testing';
import { ApartmentService } from './services/apartment.service';
import { ApartmentRepository } from './repositories/apartment.repository';
import { PrismaService } from '../../database/prisma.service';

describe('ApartmentService', () => {
  let service: ApartmentService;
  let repository: ApartmentRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApartmentService,
        ApartmentRepository,
        {
          provide: PrismaService,
          useValue: {
            apartment: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ApartmentService>(ApartmentService);
    repository = module.get<ApartmentRepository>(ApartmentRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call repository.createApartment when creating an apartment', async () => {
    const dto = {
      name: 'Test Apartment',
      address: '123 Test St',
      city: 'Test City',
      country: 'Kenya',
    };
    const user = { role: { name: 'SUPER_ADMIN' } };
    
    jest.spyOn(repository, 'createApartment').mockResolvedValue({} as any);

    await service.createApartment(user, dto);
    
    expect(repository.createApartment).toHaveBeenCalledWith(dto);
  });
});
