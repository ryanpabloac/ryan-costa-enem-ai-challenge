import { fastify, type FastifyInstance } from 'fastify';
import cors from '@fastify/cors';

export class App {
  private readonly app: FastifyInstance;

  constructor() {
    this.app = fastify({ logger: true });
  }

  async setupApp(): Promise<App> {
    await this.app.register(cors, { origin: '*' });
        
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