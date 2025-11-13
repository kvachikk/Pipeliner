import 'dotenv/config';

import { URL } from 'url';

import { DatabaseConfig } from '../common/database/database-config';

const createDatabaseConfig = (url: string): DatabaseConfig => {
   if (!url) {
      return {
         dialect: 'postgres',
         logging: false,
         pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
         dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
      };
   }

   const dbUrl = new URL(url.replace('postgresql://', 'postgres://'));

   return {
      dialect: 'postgres',
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
