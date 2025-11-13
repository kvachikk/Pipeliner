import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { User } from '../../common/database/models/user.models';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
   constructor(@InjectModel(User) private userRepository: typeof User) {}

   async create(createUserDto: CreateUserDto): Promise<User> {
      // TODO: hashing
      return await this.userRepository.create({
         email: createUserDto.email,
         passwordHash: 'hash_' + createUserDto.password,
      });
   }

   async findAll(): Promise<User[]> {
      return await this.userRepository.findAll();
   }

   async findOne(id: string): Promise<User | null> {
      return await this.userRepository.findByPk(id);
   }

   async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
      const user = await this.userRepository.findByPk(id);
      if (!user) return null;
      if (updateUserDto.password) {
         user.passwordHash = 'hash_' + updateUserDto.password;
      }
      if (updateUserDto.email) {
         user.email = updateUserDto.email;
      }
      await user.save();
      return user;
   }

   async remove(id: string): Promise<boolean> {
      const user = await this.userRepository.findByPk(id);
      if (!user) return false;
      await user.destroy();
      return true;
   }
}
