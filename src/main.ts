import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { v4 as uuid } from 'uuid';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Gateway');

  app.setGlobalPrefix('api/v1');

  app.enableCors({
    origin: '*', // dev mode
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    exposedHeaders: 'X-Request-Id',
  });

  app.use((req: any, res: any, next: () => void) => {
    const start = Date.now();
    const id = (req.headers['x-request-id'] as string) || uuid();
    req.requestId = id;
    res.setHeader('X-Request-Id', id);

    res.on('finish', () => {
      const duration = Date.now() - start;
      const userId = req.user?.userId || req.headers['x-user-id'] || 'anonymous';
      logger.log(
        `${req.method} ${req.originalUrl || req.url} - ${res.statusCode} - ${duration}ms - user=${userId} - reqId=${id}`,
      );
    });

    next();
  });

  const port = process.env.PORT || 3004;
  await app.listen(port);
  logger.log(`Gateway listening on port ${port}`);
}
bootstrap();
