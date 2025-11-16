import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Feed } from '../../common/database/models/feed.models';

import { FeedsController } from './feeds.controller';
import { FeedsService } from './feeds.service';

@Module({
   imports: [SequelizeModule.forFeature([Feed])],
   controllers: [FeedsController],
   providers: [FeedsService],
})
export class FeedsModule {}
