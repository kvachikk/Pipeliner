import { sequelize } from '../sequelize';

export const testConnection = async (): Promise<void> => {
   await sequelize
      .authenticate()
      .then(() => {
         console.log('Connection has been established successfully.');
      })
      .catch((err) => {
         console.error('Unable to connect to the database:', err);
      });
   await sequelize.sync();
};
