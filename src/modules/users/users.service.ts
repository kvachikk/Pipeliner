import { Injectable } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
   private users: User[] = [
      {
         id: 'user-1',
         email: 'test@example.com',
         passwordHash: 'hashed_password_123',
         createdAt: new Date(),
         updatedAt: new Date(),
      },
   ];

   create(createUserDto: CreateUserDto): User {
      const newUser: User = {
         id: 'user-' + Date.now(),
         email: createUserDto.email,
         passwordHash: 'mock_hash_' + createUserDto.password,
         createdAt: new Date(),
         updatedAt: new Date(),
      };
      this.users.push(newUser);
      return newUser;
   }

   findAll(): User[] {
      return this.users;
   }

   findOne(id: string): User | undefined {
      return this.users.find((user) => user.id === id);
   }

   update(id: string, updateUserDto: UpdateUserDto): User | undefined {
      const userIndex = this.users.findIndex((user) => user.id === id);
      if (userIndex > -1) {
         this.users[userIndex] = { ...this.users[userIndex], ...updateUserDto, updatedAt: new Date() };
         return this.users[userIndex];
      }
      return undefined;
   }

   remove(id: string): boolean {
      const userIndex = this.users.findIndex((user) => user.id === id);
      if (userIndex > -1) {
         this.users.splice(userIndex, 1);
         return true;
      }
      return false;
   }
}
