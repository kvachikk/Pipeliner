import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { User } from '../../common/database/models/user.models';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
   imports: [SequelizeModule.forFeature([User])],
   controllers: [UsersController],
   providers: [UsersService],
})
export class UsersModule {}
