import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { AllExceptionsFilter } from './validation-error.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api/v1');
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
