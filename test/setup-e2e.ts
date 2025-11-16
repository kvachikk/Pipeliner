import 'reflect-metadata';
import { config } from 'dotenv';

config({ path: '.env.test' });

process.env.NODE_ENV = 'test';
process.env.RUN_ENVIROMENT = 'test';

jest.setTimeout(30000);
