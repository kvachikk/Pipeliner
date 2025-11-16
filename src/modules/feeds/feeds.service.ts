import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Feed } from '../../common/database/models/feed.models';

import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';

@Injectable()
export class FeedsService {
   constructor(
      @InjectModel(Feed)
      private feedRepository: typeof Feed,
   ) {}

   async create(createFeedDto: CreateFeedDto): Promise<Feed> {
      return await this.feedRepository.create({ ...createFeedDto });
   }

   async findAll(): Promise<Feed[]> {
      return await this.feedRepository.findAll();
   }

   async findOne(id: string): Promise<Feed | null> {
      return await this.feedRepository.findByPk(id);
   }

   async update(id: string, updateFeedDto: UpdateFeedDto): Promise<Feed | null> {
      const feed = await this.feedRepository.findByPk(id);
      if (!feed) return null;
      await feed.update(updateFeedDto);
      return feed;
   }

   async remove(id: string): Promise<boolean> {
      const feed = await this.feedRepository.findByPk(id);
      if (!feed) return false;
      await feed.destroy();
      return true;
   }
}
