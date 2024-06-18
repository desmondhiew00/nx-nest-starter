import { PrismaError } from "@app/core";
import { PrismaService } from "@app/db";
import { FindManyPostArgs, FindUniquePostArgs } from "@generated/graphql";
import { Injectable } from "@nestjs/common";
import { PrismaSelect } from "@paljs/plugins";
import { GraphQLResolveInfo } from "graphql";

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async posts(args: FindManyPostArgs, info: GraphQLResolveInfo) {
    try {
      const select = new PrismaSelect(info).value["select"];
      const total = select.total ? await this.prisma.post.count({ where: args.where }) : 0;
      const data = await this.prisma.post.findMany({
        ...args,
        ...select["data"],
      });
      return { total, data };
    } catch (error) {
      throw new PrismaError(error);
    }
  }

  async post(args: FindUniquePostArgs, info: GraphQLResolveInfo) {
    try {
      const select = new PrismaSelect(info).value["select"];
      return this.prisma.post.findUnique({ where: args.where, select });
    } catch (error) {
      throw new PrismaError(error);
    }
  }
}
