import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';

import { User } from '../../common/database/models/user.models';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

describe('UsersService', () => {
   let service: UsersService;
   let userRepository: typeof User;

   const mockUser = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'test@example.com',
      passwordHash: 'hash_password123',
      save: jest.fn(),
      destroy: jest.fn(),
      createdAt: new Date(),
      updatedAt: new Date(),
   };

   const mockUserRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findByPk: jest.fn(),
   };

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            UsersService,
            {
               provide: getModelToken(User),
               useValue: mockUserRepository,
            },
         ],
      }).compile();

      service = module.get<UsersService>(UsersService);
      userRepository = module.get<typeof User>(getModelToken(User));

      jest.clearAllMocks();
   });

   afterEach(() => {
      jest.clearAllMocks();
   });

   it('should be defined', () => {
      expect(service).toBeDefined();
   });

   describe('create', () => {
      it('should create a new user with hashed password', async () => {
         const createUserDto: CreateUserDto = {
            email: 'newuser@example.com',
            password: 'password123',
         };

         const expectedUser = {
            id: 'new-uuid',
            email: createUserDto.email,
            passwordHash: 'hash_' + createUserDto.password,
         };

         mockUserRepository.create.mockResolvedValue(expectedUser);

         const result = await service.create(createUserDto);

         expect(mockUserRepository.create).toHaveBeenCalledWith({
            email: createUserDto.email,
            passwordHash: 'hash_' + createUserDto.password,
         });
         expect(result).toEqual(expectedUser);
         expect(mockUserRepository.create).toHaveBeenCalledTimes(1);
      });

      it('should handle database error when creating user', async () => {
         const createUserDto: CreateUserDto = {
            email: 'error@example.com',
            password: 'password123',
         };

         mockUserRepository.create.mockRejectedValue(new Error('Database error'));
         await expect(service.create(createUserDto)).rejects.toThrow('Database error');
      });

      it('should create user with minimal password length', async () => {
         const createUserDto: CreateUserDto = {
            email: 'min@example.com',
            password: '123456',
         };

         const expectedUser = {
            id: 'min-uuid',
            email: createUserDto.email,
            passwordHash: 'hash_123456',
         };

         mockUserRepository.create.mockResolvedValue(expectedUser);

         const result = await service.create(createUserDto);

         expect(result.passwordHash).toBe('hash_123456');
         expect(result.email).toBe('min@example.com');
      });
   });

   describe('findAll', () => {
      it('should return an array of users', async () => {
         const mockUsers = [
            { id: '1', email: 'user1@example.com', passwordHash: 'hash1' },
            { id: '2', email: 'user2@example.com', passwordHash: 'hash2' },
            { id: '3', email: 'user3@example.com', passwordHash: 'hash3' },
         ];

         mockUserRepository.findAll.mockResolvedValue(mockUsers);

         const result = await service.findAll();
         expect(result).toEqual(mockUsers);
         expect(result).toHaveLength(3);
         expect(mockUserRepository.findAll).toHaveBeenCalledTimes(1);
         expect(mockUserRepository.findAll).toHaveBeenCalledWith();
      });

      it('should return empty array when no users exist', async () => {
         mockUserRepository.findAll.mockResolvedValue([]);

         const result = await service.findAll();
         expect(result).toEqual([]);
         expect(result).toHaveLength(0);
         expect(mockUserRepository.findAll).toHaveBeenCalledTimes(1);
      });

      it('should handle database error when finding all users', async () => {
         mockUserRepository.findAll.mockRejectedValue(new Error('Connection lost'));

         await expect(service.findAll()).rejects.toThrow('Connection lost');
      });
   });

   describe('findOne', () => {
      it('should return a user by id', async () => {
         const userId = '550e8400-e29b-41d4-a716-446655440000';
         mockUserRepository.findByPk.mockResolvedValue(mockUser);

         const result = await service.findOne(userId);
         expect(result).toEqual(mockUser);
         expect(mockUserRepository.findByPk).toHaveBeenCalledWith(userId);
         expect(mockUserRepository.findByPk).toHaveBeenCalledTimes(1);
      });

      it('should return null when user not found', async () => {
         const userId = '00000000-0000-0000-0000-000000000000';
         mockUserRepository.findByPk.mockResolvedValue(null);

         const result = await service.findOne(userId);
         expect(result).toBeNull();
      });

      it('should handle empty string id', async () => {
         expect(await service.findOne('')).toBeNull();
      });
   });

   describe('update', () => {
      it('should update user email and password', async () => {
         const userId = '550e8400-e29b-41d4-a716-446655440000';
         const updateUserDto: UpdateUserDto = {
            email: 'updated@example.com',
            password: 'newpassword123',
         };

         const userMock = {
            ...mockUser,
            save: jest.fn().mockResolvedValue(true),
         };

         mockUserRepository.findByPk.mockResolvedValue(userMock);

         const result = await service.update(userId, updateUserDto);
         expect(mockUserRepository.findByPk).toHaveBeenCalledWith(userId);
         expect(userMock.email).toBe('updated@example.com');
         expect(userMock.passwordHash).toBe('hash_newpassword123');
         expect(userMock.save).toHaveBeenCalled();
         expect(result).toEqual(userMock);
      });

      it('should update only email when password not provided', async () => {
         const userId = '550e8400-e29b-41d4-a716-446655440000';
         const updateUserDto: UpdateUserDto = {
            email: 'onlyemail@example.com',
         };

         const userMock = {
            ...mockUser,
            email: 'old@example.com',
            passwordHash: 'old_hash',
            save: jest.fn().mockResolvedValue(true),
         };

         mockUserRepository.findByPk.mockResolvedValue(userMock);

         const result = await service.update(userId, updateUserDto);
         expect(userMock.email).toBe('onlyemail@example.com');
         expect(userMock.passwordHash).toBe('old_hash');
         expect(userMock.save).toHaveBeenCalled();
         expect(result).toEqual(userMock);
      });

      it('should update only password when email not provided', async () => {
         const userId = '550e8400-e29b-41d4-a716-446655440000';
         const updateUserDto: UpdateUserDto = {
            password: 'onlypassword123',
         };

         const userMock = {
            ...mockUser,
            email: 'unchanged@example.com',
            passwordHash: 'old_hash',
            save: jest.fn().mockResolvedValue(true),
         };

         mockUserRepository.findByPk.mockResolvedValue(userMock);

         const result = await service.update(userId, updateUserDto);

         expect(userMock.email).toBe('unchanged@example.com');
         expect(userMock.passwordHash).toBe('hash_onlypassword123');
         expect(userMock.save).toHaveBeenCalled();
         expect(result).toEqual(userMock);
      });

      it('should return null when user not found', async () => {
         const userId = '00000000-0000-0000-0000-000000000000';
         const updateUserDto: UpdateUserDto = {
            email: 'test@example.com',
         };

         mockUserRepository.findByPk.mockResolvedValue(null);

         const result = await service.update(userId, updateUserDto);
         expect(result).toBeNull();
      });

      it('should handle empty update DTO', async () => {
         const userId = '550e8400-e29b-41d4-a716-446655440000';
         const updateUserDto: UpdateUserDto = {};

         const userMock = {
            ...mockUser,
            email: 'unchanged@example.com',
            passwordHash: 'unchanged_hash',
            save: jest.fn().mockResolvedValue(true),
         };

         mockUserRepository.findByPk.mockResolvedValue(userMock);

         const result = await service.update(userId, updateUserDto);
         expect(userMock.email).toBe('unchanged@example.com');
         expect(userMock.passwordHash).toBe('unchanged_hash');
         expect(userMock.save).toHaveBeenCalled();
         expect(result).toEqual(userMock);
      });

      it('should handle save error', async () => {
         const userId = '550e8400-e29b-41d4-a716-446655440000';
         const updateUserDto: UpdateUserDto = {
            email: 'error@example.com',
         };

         const userMock = {
            ...mockUser,
            save: jest.fn().mockRejectedValue(new Error('Save failed')),
         };

         mockUserRepository.findByPk.mockResolvedValue(userMock);

         await expect(service.update(userId, updateUserDto)).rejects.toThrow('Save failed');
      });
   });

   describe('remove', () => {
      it('should successfully remove a user', async () => {
         const userId = '550e8400-e29b-41d4-a716-446655440000';
         const userMock = {
            ...mockUser,
            destroy: jest.fn().mockResolvedValue(true),
         };

         mockUserRepository.findByPk.mockResolvedValue(userMock);

         const result = await service.remove(userId);
         expect(result).toBe(true);
         expect(mockUserRepository.findByPk).toHaveBeenCalledWith(userId);
         expect(userMock.destroy).toHaveBeenCalled();
      });

      it('should return false when user not found', async () => {
         const userId = '00000000-0000-0000-0000-000000000000';
         mockUserRepository.findByPk.mockResolvedValue(null);

         const result = await service.remove(userId);

         expect(result).toBe(false);
      });

      it('should handle destroy error', async () => {
         const userId = '550e8400-e29b-41d4-a716-446655440000';
         const userMock = {
            ...mockUser,
            destroy: jest.fn().mockRejectedValue(new Error('Destroy failed')),
         };

         mockUserRepository.findByPk.mockResolvedValue(userMock);

         await expect(service.remove(userId)).rejects.toThrow('Destroy failed');
         expect(userMock.destroy).toHaveBeenCalled();
      });

      it('should handle removing user with empty id', async () => {
         const result = await service.remove('');
         expect(result).toBe(false);
      });
   });
});
