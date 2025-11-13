import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
   constructor(private readonly usersService: UsersService) {}

   @Post()
   @UsePipes(new ValidationPipe())
   async create(@Body() createUserDto: CreateUserDto) {
      return this.usersService.create(createUserDto);
   }

   @Get()
   async findAll() {
      return this.usersService.findAll();
   }

   @Get(':id')
   async findOne(@Param('id') id: string) {
      return this.usersService.findOne(id);
   }

   @Patch(':id')
   @UsePipes(new ValidationPipe())
   async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
      return this.usersService.update(id, updateUserDto);
   }

   @Delete(':id')
   async remove(@Param('id') id: string) {
      return this.usersService.remove(id);
   }
}
