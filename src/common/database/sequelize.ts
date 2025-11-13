import { Sequelize } from 'sequelize-typescript';

import { databaseConfig } from '../../config/database.config';

const dbConfig = databaseConfig.current;

export const sequelize = new Sequelize({
   ...dbConfig,
   dialect: dbConfig.dialect,
   logging: dbConfig.logging,
   pool: dbConfig.pool,
   dialectOptions: dbConfig.dialectOptions,
});
