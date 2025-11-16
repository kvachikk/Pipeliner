import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { testConnection } from './common/database/utils/database-connect';

async function bootstrap() {
   await testConnection();
   const app = await NestFactory.create(AppModule);
   await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
