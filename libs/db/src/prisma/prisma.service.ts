import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

import { S3UrlExtension } from "./extensions/s3-url.extension";
import { SoftDeleteExtension } from "./extensions/soft-delete.extension";
import { UserExtension } from "./extensions/user.extension";

const client = new PrismaClient({
  log: [{ emit: "event", level: "query" }],
});

// client.$on('query', (e) => {
//   console.info('Query: ' + e.query);
//   console.info('Params: ' + e.params);
//   console.info('Duration: ' + e.duration + 'ms');
// });

export const prismaClient = client.$extends(SoftDeleteExtension).$extends(UserExtension).$extends(S3UrlExtension);

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  readonly extendedClient = prismaClient;

  constructor() {
    super({ datasourceUrl: "", datasources: { db: { url: "" } } });
    // biome-ignore lint/correctness/noConstructorReturn: <explanation>
    return new Proxy(this, {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      get: (target: any, key: string) => Reflect.get(key in prismaClient ? prismaClient : target, key),
    });
  }
  async onModuleInit() {
    //
  }
}
