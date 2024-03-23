import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService, ConfigModule } from '@socialize-app/config';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

type Config = {
  port: number;
};

const retrieveConfig = async (): Promise<Config> => {
  const configModule = await NestFactory.create(ConfigModule.register());
  const configService = configModule.get(ConfigService);
  const port = await configService.get('USER_SERVICE_PORT');

  console.log('port:', port);

  configModule.close();

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
