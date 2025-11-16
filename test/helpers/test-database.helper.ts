import { Sequelize } from 'sequelize-typescript';

import { Article } from '../../src/common/database/models/article.models';
import { Feed } from '../../src/common/database/models/feed.models';
import { User } from '../../src/common/database/models/user.models';

export class TestDatabaseHelper {
   private static sequelize: Sequelize;

   static async setupTestDatabase(): Promise<Sequelize> {
      this.sequelize = new Sequelize({
         dialect: 'sqlite',
         storage: ':memory:',
         logging: false,
         models: [User, Feed, Article],
      });

      await this.sequelize.sync({ force: true });
      return this.sequelize;
   }

   static async cleanDatabase(): Promise<void> {
      if (this.sequelize) {
         await this.sequelize.truncate({ cascade: true, force: true });
      }
   }

   static async closeDatabase(): Promise<void> {
      if (this.sequelize) {
         await this.sequelize.close();
      }
   }

   static async seedTestData() {
      const users = await User.bulkCreate([
         {
            email: 'test1@example.com',
            passwordHash: 'hash_password123',
         },
         {
            email: 'test2@example.com',
            passwordHash: 'hash_password456',
         },
         {
            email: 'admin@example.com',
            passwordHash: 'hash_admin123',
         },
      ]);

      const feeds = await Feed.bulkCreate([
         {
            name: 'Tech News',
            url: 'https://technews.com/rss',
            userId: users[0].id,
         },
         {
            name: 'Science Daily',
            url: 'https://sciencedaily.com/rss',
            userId: users[1].id,
         },
      ]);

      return { users, feeds };
   }

   static getSequelize(): Sequelize {
      return this.sequelize;
   }
}
