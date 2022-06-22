import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    //create a fake copy of the users service
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const newUser = {
          email,
          password,
          id: Math.floor(Math.random() * 999999),
        } as User;
        users.push(newUser);
        return Promise.resolve(newUser);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService, //proxies the fakeUserService to UsersService
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth instance', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('test@test.com', 'test0123');
    expect(user.password).not.toEqual('test0123');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    await service.signup('test@test.com', 'test0123');
    await expect(service.signup('test@test.com', 'asdf')).rejects.toThrowError(
      BadRequestException,
    );
  });

  it('throws an error if signin is called with an unused email', async () => {
    await expect(service.signin('asda@asda.com', 'asdf')).rejects.toThrowError(
      NotFoundException,
    );
  });

  it('throws an error if invalid password is provided', async () => {
    await service.signup('test@test.com', 'test0123');

    await expect(
      service.signin('test@test.com', 'password'),
    ).rejects.toThrowError(BadRequestException);
  });

  it('returns a user if correct password is provided', async () => {
    await service.signup('test@test.com', 'test0123');
    const user = await service.signin('test@test.com', 'test0123');
    expect(user).toBeDefined();
  });
});
