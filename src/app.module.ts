import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FeedsModule } from './modules/feeds/feeds.module';
import { UsersModule } from './modules/users/users.module';

@Module({
   imports: [FeedsModule, UsersModule],
   controllers: [AppController],
   providers: [AppService],
})
export class AppModule {}
