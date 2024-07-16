import { createClient } from 'redis';
import Logger from 'bunyan';
import { config } from '@root/config';

export type RedisClient = ReturnType<typeof createClient>;

export abstract class BaseCache {
  client: RedisClient;
  log: Logger;

  constructor(cacheName: string) {
    this.client = createClient({ url: config.REDIS_HOST });
    // this.client = createClient({
    //   password: 'ar2iR0IGZbB8JPNkR4Gs3lQVmEBTH8GP',
    //   socket: {
    //       host: 'redis-11893.c329.us-east4-1.gce.redns.redis-cloud.com',
    //       port: 11893
    //   }
    // });
    this.log = config.createLogger(cacheName);
    this.cacheError();
    // this.connectClient();

  }

  private cacheError(): void {
    this.client.on('error', (error: unknown) => {
      this.log.error(error);
    });
  }

}
