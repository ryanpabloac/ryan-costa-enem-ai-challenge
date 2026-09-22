import { fastify, type FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from 'fastify-type-provider-zod';
import { AppError } from './errors/app.error.js';

export class App {
  private readonly app: FastifyInstance;

  constructor() {
    this.app = fastify({ logger: true });
  }

  async setupApp(): Promise<App> {
    this.app.withTypeProvider<ZodTypeProvider>;
    this.app.setValidatorCompiler(validatorCompiler);
    this.app.setSerializerCompiler(serializerCompiler);
    await this.app.register(cors, { origin: '*' });

    this.app.setErrorHandler((error, req, reply) => {
      if (error instanceof AppError) {
        return reply.status(error.status).send(error.toProblemDetail());
      }
      return reply.send(error);
    });

    return this;
  }

  getInstance(): FastifyInstance {
    return this.app;
  }

  start(host: string, port: number) {
    this.app.listen({ port, host })
      .then(() => console.log(`Server started: ${port}`))
      .catch((err) => {
        console.error(err);
        process.exit(1);
      });
  }

  finish() {
    return this.app.close().then(() => console.log('Server closed'));
  }
}