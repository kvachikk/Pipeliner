export interface DatabaseConfig {
   host?: string;
   port?: number;
   username?: string;
   password?: string;
   database?: string;
   dialect: 'postgres';
   logging: boolean;
   pool: {
      max: number;
      min: number;
      acquire: number;
      idle: number;
   };
   dialectOptions: {
      ssl: {
         require: boolean;
         rejectUnauthorized: boolean;
      };
   };
}
