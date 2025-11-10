import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';
import { FeedsService } from './feeds.service';

@Controller('feeds')
export class FeedsController {
   private readonly feedsService: FeedsService;

   constructor(feedsService: FeedsService) {
      this.feedsService = feedsService;
   }

   @Post()
   create(@Body() createFeedDto: CreateFeedDto) {
      return this.feedsService.create(createFeedDto);
   }

   @Get()
   findAll() {
      return this.feedsService.findAll();
   }

   @Get(':id')
   findOne(@Param('id') id: string) {
      return this.feedsService.findOne(id);
   }

   @Patch(':id')
   update(@Param('id') id: string, @Body() updateFeedDto: UpdateFeedDto) {
      return this.feedsService.update(id, updateFeedDto);
   }

   @Delete(':id')
   remove(@Param('id') id: string) {
      return this.feedsService.remove(id);
   }
}
