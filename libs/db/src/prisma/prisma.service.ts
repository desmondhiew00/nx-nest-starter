import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { createSoftDeleteExtension } from 'prisma-extension-soft-delete';

const client = new PrismaClient({
  log: [{ emit: 'event', level: 'query' }]
});

const softDeleteExtension = createSoftDeleteExtension({
  defaultConfig: {
    field: 'deletedAt',
    createValue: (deleted) => {
      if (deleted) return new Date();
      return null;
    }
  },
  models: {
    User: true
  }
});

export const extendedClient = client.$extends(softDeleteExtension).$extends({
  name: "add hello to user name",
  result: {
    user: {
      fullName: {
        needs: { name: true },
        compute(user) {
          return `hello ${user.name}`;
        }
      }
    }
  }
});

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  readonly extendedClient = extendedClient;

  constructor() {
    super({ datasourceUrl: '', datasources: { db: { url: '' } } });
    return new Proxy(this, {
      get: (target: any, key: string) => Reflect.get(key in extendedClient ? extendedClient : target, key)
    });
  }
  async onModuleInit() {
    //
  }
}
