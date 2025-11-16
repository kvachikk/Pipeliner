import { Dialect } from 'sequelize';

export interface DatabaseConfig {
   host?: string;
   port?: number;
   username?: string;
   password?: string;
   database?: string;
   storage?: string; // For SQLite
   dialect: Dialect;
   logging: boolean;
   pool?: {
      max: number;
      min: number;
      acquire: number;
      idle: number;
   };
   dialectOptions?: {
      ssl?: {
         require: boolean;
         rejectUnauthorized: boolean;
      };
   };
}
