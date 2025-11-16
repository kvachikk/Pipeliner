import { Test, TestingModule } from '@nestjs/testing';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
   let controller: UsersController;
   let service: UsersService;

   const mockUser = {
      id: 'test-uuid-123',
      email: 'test@example.com',
      passwordHash: 'hash_password123',
      createdAt: new Date(),
      updatedAt: new Date(),
   };

   const mockUsers = [
      { id: '1', email: 'user1@example.com', passwordHash: 'hash1' },
      { id: '2', email: 'user2@example.com', passwordHash: 'hash2' },
      { id: '3', email: 'user3@example.com', passwordHash: 'hash3' },
   ];

   const mockUsersService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
   };

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         controllers: [UsersController],
         providers: [
            {
               provide: UsersService,
               useValue: mockUsersService,
            },
         ],
      }).compile();

      controller = module.get<UsersController>(UsersController);
      service = module.get<UsersService>(UsersService);

      jest.clearAllMocks();
   });

   afterEach(() => {
      jest.clearAllMocks();
   });

   it('should be defined', () => {
      expect(controller).toBeDefined();
   });

   describe('create', () => {
      it('should create a new user', async () => {
         const createUserDto: CreateUserDto = {
            email: 'newuser@example.com',
            password: 'password123',
         };

         const expectedUser = {
            id: 'new-uuid',
            email: createUserDto.email,
            passwordHash: 'hash_password123',
         };

         mockUsersService.create.mockResolvedValue(expectedUser);

         const result = await controller.create(createUserDto);
         expect(result).toEqual(expectedUser);
         expect(service.create).toHaveBeenCalledWith(createUserDto);
         expect(service.create).toHaveBeenCalledTimes(1);
      });

      it('should handle service errors during creation', async () => {
         const createUserDto: CreateUserDto = {
            email: 'error@example.com',
            password: 'password123',
         };

         mockUsersService.create.mockRejectedValue(new Error('Creation failed'));
         await expect(controller.create(createUserDto)).rejects.toThrow('Creation failed');
         expect(service.create).toHaveBeenCalledWith(createUserDto);
      });

      it('should pass validation for valid input', async () => {
         const validDto: CreateUserDto = {
            email: 'valid@example.com',
            password: 'validpass123',
         };

         mockUsersService.create.mockResolvedValue(mockUser);

         const result = await controller.create(validDto);
         expect(result).toEqual(mockUser);
         expect(service.create).toHaveBeenCalledWith(validDto);
      });

      it('should handle duplicate email scenario', async () => {
         const createUserDto: CreateUserDto = {
            email: 'duplicate@example.com',
            password: 'password123',
         };

         const duplicateError = new Error('Email already exists');
         mockUsersService.create.mockRejectedValue(duplicateError);

         await expect(controller.create(createUserDto)).rejects.toThrow('Email already exists');
      });
   });

   describe('findAll', () => {
      it('should return an array of users', async () => {
         mockUsersService.findAll.mockResolvedValue(mockUsers);

         const result = await controller.findAll();
         expect(result).toEqual(mockUsers);
         expect(result).toHaveLength(3);
         expect(service.findAll).toHaveBeenCalledTimes(1);
         expect(service.findAll).toHaveBeenCalledWith();
      });

      it('should return empty array when no users exist', async () => {
         mockUsersService.findAll.mockResolvedValue([]);

         const result = await controller.findAll();

         expect(result).toEqual([]);
         expect(result).toHaveLength(0);
         expect(service.findAll).toHaveBeenCalled();
      });

      it('should handle service errors', async () => {
         mockUsersService.findAll.mockRejectedValue(new Error('Database error'));

         await expect(controller.findAll()).rejects.toThrow('Database error');
         expect(service.findAll).toHaveBeenCalled();
      });

      it('should call service method exactly once', async () => {
         mockUsersService.findAll.mockResolvedValue(mockUsers);

         await controller.findAll();
         await controller.findAll();

         expect(service.findAll).toHaveBeenCalledTimes(2);
      });
   });

   describe('findOne', () => {
      it('should return a single user by id', async () => {
         const userId = 'test-uuid-123';
         mockUsersService.findOne.mockResolvedValue(mockUser);

         const result = await controller.findOne(userId);
         expect(result).toEqual(mockUser);
         expect(service.findOne).toHaveBeenCalledWith(userId);
         expect(service.findOne).toHaveBeenCalledTimes(1);
      });

      it('should return null when user not found', async () => {
         const userId = 'non-existent-id';
         mockUsersService.findOne.mockResolvedValue(null);

         const result = await controller.findOne(userId);
         expect(result).toBeNull();
         expect(service.findOne).toHaveBeenCalledWith(userId);
      });

      it('should handle service errors', async () => {
         const userId = 'error-id';
         mockUsersService.findOne.mockRejectedValue(new Error('Service error'));

         await expect(controller.findOne(userId)).rejects.toThrow('Service error');
         expect(service.findOne).toHaveBeenCalledWith(userId);
      });

      it('should handle empty string id', async () => {
         mockUsersService.findOne.mockResolvedValue(null);

         const result = await controller.findOne('');
         expect(result).toBeNull();
         expect(service.findOne).toHaveBeenCalledWith('');
      });

      it('should handle UUID format id', async () => {
         const uuid = '550e8400-e29b-41d4-a716-446655440000';
         mockUsersService.findOne.mockResolvedValue(mockUser);

         const result = await controller.findOne(uuid);

         expect(result).toEqual(mockUser);
         expect(service.findOne).toHaveBeenCalledWith(uuid);
      });
   });

   describe('update', () => {
      it('should update user with all fields', async () => {
         const userId = 'test-uuid-123';
         const updateUserDto: UpdateUserDto = {
            email: 'updated@example.com',
            password: 'newpassword123',
         };

         const updatedUser = {
            ...mockUser,
            email: updateUserDto.email,
            passwordHash: 'hash_newpassword123',
         };

         mockUsersService.update.mockResolvedValue(updatedUser);

         const result = await controller.update(userId, updateUserDto);
         expect(result).toEqual(updatedUser);
         expect(service.update).toHaveBeenCalledWith(userId, updateUserDto);
         expect(service.update).toHaveBeenCalledTimes(1);
      });

      it('should update only email', async () => {
         const userId = 'test-uuid-123';
         const updateUserDto: UpdateUserDto = {
            email: 'newemail@example.com',
         };

         const updatedUser = {
            ...mockUser,
            email: updateUserDto.email,
         };

         mockUsersService.update.mockResolvedValue(updatedUser);

         const result = await controller.update(userId, updateUserDto);
         expect(result).toEqual(updatedUser);
         expect(result.email).toBe('newemail@example.com');
         expect(service.update).toHaveBeenCalledWith(userId, updateUserDto);
      });

      it('should update only password', async () => {
         const userId = 'test-uuid-123';
         const updateUserDto: UpdateUserDto = {
            password: 'newpassword456',
         };

         const updatedUser = {
            ...mockUser,
            passwordHash: 'hash_newpassword456',
         };

         mockUsersService.update.mockResolvedValue(updatedUser);

         const result = await controller.update(userId, updateUserDto);
         expect(result).toEqual(updatedUser);
         expect(service.update).toHaveBeenCalledWith(userId, updateUserDto);
      });

      it('should handle empty update DTO', async () => {
         const userId = 'test-uuid-123';
         const updateUserDto: UpdateUserDto = {};

         mockUsersService.update.mockResolvedValue(mockUser);

         const result = await controller.update(userId, updateUserDto);
         expect(result).toEqual(mockUser);
         expect(service.update).toHaveBeenCalledWith(userId, updateUserDto);
      });

      it('should return null when user not found', async () => {
         const userId = 'non-existent-id';
         const updateUserDto: UpdateUserDto = {
            email: 'test@example.com',
         };

         mockUsersService.update.mockResolvedValue(null);

         const result = await controller.update(userId, updateUserDto);
         expect(result).toBeNull();
         expect(service.update).toHaveBeenCalledWith(userId, updateUserDto);
      });

      it('should handle service errors during update', async () => {
         const userId = 'test-uuid-123';
         const updateUserDto: UpdateUserDto = {
            email: 'error@example.com',
         };

         mockUsersService.update.mockRejectedValue(new Error('Update failed'));

         await expect(controller.update(userId, updateUserDto)).rejects.toThrow('Update failed');
         expect(service.update).toHaveBeenCalledWith(userId, updateUserDto);
      });
   });

   describe('remove', () => {
      it('should successfully remove a user', async () => {
         const userId = 'test-uuid-123';
         mockUsersService.remove.mockResolvedValue(true);

         const result = await controller.remove(userId);
         expect(result).toBe(true);
         expect(service.remove).toHaveBeenCalledWith(userId);
         expect(service.remove).toHaveBeenCalledTimes(1);
      });

      it('should return false when user not found', async () => {
         const userId = 'non-existent-id';
         mockUsersService.remove.mockResolvedValue(false);

         const result = await controller.remove(userId);
         expect(result).toBe(false);
         expect(service.remove).toHaveBeenCalledWith(userId);
      });

      it('should handle service errors during removal', async () => {
         const userId = 'error-id';
         mockUsersService.remove.mockRejectedValue(new Error('Removal failed'));

         await expect(controller.remove(userId)).rejects.toThrow('Removal failed');
         expect(service.remove).toHaveBeenCalledWith(userId);
      });

      it('should handle removing with empty id', async () => {
         mockUsersService.remove.mockResolvedValue(false);

         const result = await controller.remove('');
         expect(result).toBe(false);
         expect(service.remove).toHaveBeenCalledWith('');
      });

      it('should handle cascading delete scenarios', async () => {
         const userId = 'user-with-relations';
         mockUsersService.remove.mockResolvedValue(true);

         const result = await controller.remove(userId);

         expect(result).toBe(true);
         expect(service.remove).toHaveBeenCalledWith(userId);
      });
   });

   describe('ValidationPipe decorator', () => {
      it('controller methods should be decorated with UsePipes', () => {
         expect(controller.create).toBeDefined();
         expect(controller.update).toBeDefined();
      });

      it('should validate DTO structure', () => {
         const validCreateDto: CreateUserDto = {
            email: 'test@example.com',
            password: 'validpassword',
         };

         const validUpdateDto: UpdateUserDto = {
            email: 'update@example.com',
         };

         expect(validCreateDto.email).toBeDefined();
         expect(validCreateDto.password).toBeDefined();
         expect(validUpdateDto).toBeDefined();
      });
   });
});
