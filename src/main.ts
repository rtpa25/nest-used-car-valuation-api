import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    cookieSession({
      keys: ['asasgfgvgr'], //used to encrypt the info in cookie
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //*strips off the additional property beyond the DTO class
    }),
  );
  await app.listen(3000);
}
bootstrap();
