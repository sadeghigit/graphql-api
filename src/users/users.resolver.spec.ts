import { Test, TestingModule } from '@nestjs/testing';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';

describe('UsersResolver', () => {
  let resolver: UsersResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        { provide: AuthService, useValue: {} },
        { provide: UsersService, useValue: {} }
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
