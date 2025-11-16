import { INestApplication, ValidationPipe } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { Sequelize } from 'sequelize-typescript';

import { AppModule } from '../../src/app.module';
import { Article } from '../../src/common/database/models/article.models';
import { Feed } from '../../src/common/database/models/feed.models';
import { User } from '../../src/common/database/models/user.models';

import { NullSerializationInterceptor } from './null-serialization.interceptor';

export class TestAppHelper {
   private static app: INestApplication;
   private static module: TestingModule;
   private static sequelize: Sequelize;

   static async createTestApp(): Promise<INestApplication> {
      this.sequelize = new Sequelize({
         dialect: 'sqlite',
         storage: ':memory:',
         logging: false,
         models: [User, Feed, Article],
      });

      this.module = await Test.createTestingModule({
         imports: [AppModule],
      })
         .overrideModule(SequelizeModule)
         .useModule(
            SequelizeModule.forRoot({
               dialect: 'sqlite',
               storage: ':memory:',
               logging: false,
               models: [User, Feed, Article],
               synchronize: true,
               autoLoadModels: true,
            }),
         )
         .compile();

      this.app = this.module.createNestApplication();

      this.app.useGlobalPipes(
         new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
         }),
      );

      // Use custom interceptor to preserve null values
      this.app.useGlobalInterceptors(new NullSerializationInterceptor());

      await this.app.init();
      await this.sequelize.sync({ force: true });
      return this.app;
   }

   static getApp(): INestApplication {
      return this.app;
   }

   static getModule(): TestingModule {
      return this.module;
   }

   static getSequelize(): Sequelize {
      return this.sequelize;
   }

   static async cleanDatabase(): Promise<void> {
      if (this.sequelize) {
         try {
            await Article.destroy({ where: {}, force: true });
            await Feed.destroy({ where: {}, force: true });
            await User.destroy({ where: {}, force: true });
         } catch (error) {
            console.warn('Warning during cleanDatabase:', error);
         }
      }
   }

   static async closeApp(): Promise<void> {
      if (this.app) {
         await this.app.close();
      }
      if (this.sequelize) {
         await this.sequelize.close();
      }
   }
}
