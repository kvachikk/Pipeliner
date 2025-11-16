import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Article } from './common/database/models/article.models';
import { Feed } from './common/database/models/feed.models';
import { User } from './common/database/models/user.models';
import { databaseConfig } from './config/database.config';
import { FeedsModule } from './modules/feeds/feeds.module';
import { UsersModule } from './modules/users/users.module';

@Module({
   imports: [
      SequelizeModule.forRoot({
         ...databaseConfig.current,
         models: [User, Feed, Article],
         autoLoadModels: true,
         synchronize: true,
      }),
      FeedsModule,
      UsersModule,
   ],
   controllers: [],
   providers: [],
})
export class AppModule {}
