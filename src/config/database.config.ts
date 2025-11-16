import 'dotenv/config';

import { URL } from 'url';

import { Dialect } from 'sequelize';

import { DatabaseConfig } from '../common/database/database-config';

const createDatabaseConfig = (url: string): DatabaseConfig => {
   // 1. Для тестів — тільки SQLite in-memory (без жодних SSL)
   if (process.env.NODE_ENV === 'test' || process.env.RUN_ENVIROMENT === 'test') {
      return {
         dialect: 'sqlite' as Dialect,
         storage: ':memory:',
         logging: false,
      };
   }

   // 2. Якщо явно задано sqlite в URL → теж використати in-memory
   if (url && url.startsWith('sqlite')) {
      return {
         dialect: 'sqlite' as Dialect,
         storage: ':memory:',
         logging: false,
      };
   }

   // ...а далі як було: для справжнього postgres з ssl
   if (!url) {
      return {
         dialect: 'postgres' as Dialect,
         logging: false,
         pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
         dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
      };
   }

   const dbUrl = new URL(url.replace('postgresql://', 'postgres://'));

   return {
      dialect: 'postgres' as Dialect,
      host: dbUrl.hostname,
      port: Number(dbUrl.port) || 5432,
      username: dbUrl.username,
      password: dbUrl.password,
      database: dbUrl.pathname.slice(1),
      logging: false,
      pool: {
         max: 5,
         min: 0,
         acquire: 30000,
         idle: 10000,
      },
      dialectOptions: {
         ssl: {
            require: true,
            rejectUnauthorized: false,
         },
      },
   };
};

const configs = {
   test: createDatabaseConfig(process.env.TEST_DB_URL || ''),
   development: createDatabaseConfig(process.env.DEVELOPMENT_DB_URL || ''),
   production: createDatabaseConfig(process.env.PRODUCTION_DB_URL || ''),
};

const getCurrentConfig = (): DatabaseConfig => {
   switch (process.env.RUN_ENVIROMENT) {
      case 'test':
         return configs.test;
      case 'production':
         return configs.production;
      case 'development':
      default:
         return configs.development;
   }
};

export const databaseConfig = {
   test: configs.test,
   development: configs.development,
   production: configs.production,
   current: getCurrentConfig(),
};
