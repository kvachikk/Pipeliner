import { Module } from '@nestjs/common';

import { FeedsModule } from './modules/feeds/feeds.module';
import { UsersModule } from './modules/users/users.module';

@Module({
   imports: [FeedsModule, UsersModule],
   controllers: [],
   providers: [],
})
export class AppModule {}
