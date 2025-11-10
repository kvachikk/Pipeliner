import { Injectable } from '@nestjs/common';

import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';
import { Feed } from './entities/feed.entity';

@Injectable()
export class FeedsService {
   // mock
   private feeds: Feed[] = [
      {
         id: '1',
         url: 'https://dou.ua/feed/',
         title: 'DOU.ua',
         createdAt: new Date(),
         updatedAt: new Date(),
      },
      {
         id: '2',
         url: 'https://dev.to/feed',
         title: 'DEV Community',
         createdAt: new Date(),
         updatedAt: new Date(),
      },
   ];

   create(createFeedDto: CreateFeedDto): Feed {
      const newFeed: Feed = {
         id: Date.now().toString(),
         url: createFeedDto.url,
         title: createFeedDto.title || 'New Feed',
         createdAt: new Date(),
         updatedAt: new Date(),
      };
      this.feeds.push(newFeed);
      return newFeed;
   }

   findAll(): Feed[] {
      return this.feeds;
   }

   findOne(id: string): Feed | undefined {
      return this.feeds.find((feed) => feed.id === id);
   }

   update(id: string, updateFeedDto: UpdateFeedDto): Feed | undefined {
      const feedIndex = this.feeds.findIndex((feed) => feed.id === id);
      if (feedIndex > -1) {
         this.feeds[feedIndex] = {
            ...this.feeds[feedIndex],
            ...updateFeedDto,
            updatedAt: new Date(),
         };
         return this.feeds[feedIndex];
      }
      return undefined;
   }

   remove(id: string): boolean {
      const feedIndex = this.feeds.findIndex((feed) => feed.id === id);
      if (feedIndex > -1) {
         this.feeds.splice(feedIndex, 1);
         return true;
      }
      return false;
   }
}
