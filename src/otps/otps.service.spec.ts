import { Test, TestingModule } from '@nestjs/testing';
import { OtpsService } from './otps.service';
import { getModelToken } from '@nestjs/mongoose';
import { Otp } from './schemas/otp.schema';

describe('OtpsService', () => {
  let service: OtpsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OtpsService,
        { provide: getModelToken(Otp.name), useValue: {} }
      ],
    }).compile();

    service = module.get<OtpsService>(OtpsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
