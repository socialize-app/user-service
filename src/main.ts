import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService, ConfigModule } from 'nest-redis-config';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

type Config = {
  port: number;
};

const retrieveConfig = async (): Promise<Config> => {
  const logger = new Logger('retrieveConfig');
  const configModule = await NestFactory.create(ConfigModule.register());
  const configService = configModule.get(ConfigService);

  let port = await configService.get('USER_SERVICE_PORT');

  if (port == 0 || port == null) {
    logger.warn(
      'Port not found in cache, setting default port to USER_SERVICE_PORT environment variable.',
    );
    await configService.set('USER_SERVICE_PORT', process.env.USER_SERVICE_PORT);
  }

  port = await configService.get('USER_SERVICE_PORT');

  return {
    port: parseInt(port),
  };
};

async function bootstrap() {
  const { port } = await retrieveConfig();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        port,
      },
    },
  );
  await app.listen();
}
bootstrap();
