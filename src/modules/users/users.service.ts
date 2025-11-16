import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UniqueConstraintError } from 'sequelize';

import { User } from '../../common/database/models/user.models';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const isValidUUID = (id: string): boolean =>
   /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

@Injectable()
export class UsersService {
   constructor(@InjectModel(User) private userRepository: typeof User) {}

   async create(createUserDto: CreateUserDto): Promise<User> {
      try {
         // TODO: hashing
         return await this.userRepository.create({
            email: createUserDto.email,
            passwordHash: 'hash_' + createUserDto.password,
         });
      } catch (error) {
         if (error instanceof UniqueConstraintError) {
            throw new ConflictException('User with this email already exists');
         }
         throw error;
      }
   }

   async findAll(): Promise<User[]> {
      return await this.userRepository.findAll();
   }

   async findOne(id: string): Promise<User | null> {
      if (!isValidUUID(id)) return null;
      return await this.userRepository.findByPk(id);
   }

   async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
      if (!isValidUUID(id)) return null;
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
      if (!isValidUUID(id)) return false;
      const user = await this.userRepository.findByPk(id);
      if (!user) return false;
      await user.destroy();
      return true;
   }
}
