import { CreateFindManyResultType } from "@app/db";
import { FindManyPostArgs, FindUniquePostArgs, Post } from "@generated/graphql";
import { Args, Info, Query, Resolver } from "@nestjs/graphql";
import { GraphQLResolveInfo } from "graphql";
import { UseJwtAuthGuard } from "../auth";
import { PostService } from "./post.service";

const PostManyResult = CreateFindManyResultType(Post);

@UseJwtAuthGuard()
@Resolver(Post)
export class PostResolver {
  constructor(private postService: PostService) {}

  @Query(() => PostManyResult)
  async posts(@Args() args: FindManyPostArgs, @Info() info: GraphQLResolveInfo) {
    return this.postService.posts(args, info);
  }

  @Query(() => Post, { nullable: true })
  async post(@Args() args: FindUniquePostArgs, @Info() info: GraphQLResolveInfo) {
    return this.postService.post(args, info);
  }
}
