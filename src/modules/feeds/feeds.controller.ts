import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';

import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';
import { FeedsService } from './feeds.service';

@Controller('feeds')
export class FeedsController {
   constructor(private readonly feedsService: FeedsService) {}

   @Post()
   @UsePipes(new ValidationPipe())
   async create(@Body() createFeedDto: CreateFeedDto) {
      return this.feedsService.create(createFeedDto);
   }

   @Get()
   async findAll() {
      return this.feedsService.findAll();
   }

   @Get(':id')
   async findOne(@Param('id') id: string) {
      return this.feedsService.findOne(id);
   }

   @Patch(':id')
   @UsePipes(new ValidationPipe())
   async update(@Param('id') id: string, @Body() updateFeedDto: UpdateFeedDto) {
      return this.feedsService.update(id, updateFeedDto);
   }

   @Delete(':id')
   async remove(@Param('id') id: string) {
      return this.feedsService.remove(id);
   }
}
