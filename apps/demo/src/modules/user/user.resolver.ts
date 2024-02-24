import { PrismaService } from '@app/db';
import { CreateFindManyResultType } from '@app/gql/helper';
import { FindManyUserArgs, User } from '@gql-generated';
import { Args, Info, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { PrismaSelect } from '@paljs/plugins';
import { GraphQLResolveInfo } from 'graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload-minimal';
import { AwsS3Service, S3KeyBuilder } from 'nestlibs-aws-s3';
import { InjectJwtAuthService, JwtAuthService } from 'nestlibs-jwt-auth';
import { UseJwtAuthGuard } from '../auth';

const UserManyResult = CreateFindManyResultType(User);

@Resolver(() => User)
export class UserResolver  {
  constructor(
    private prisma: PrismaService,
    private s3: AwsS3Service,
    @InjectJwtAuthService('main-auth') private jwtAuthService: JwtAuthService
  ) {}

  // Custom field
  @ResolveField(() => String)
  fullName(@Parent() user: any) {
    return user.fullName;
  }

  @Query(() => String)
  async getAccessToken() {
    const user = await this.prisma.user.findFirst();
    return this.jwtAuthService.generateAccessToken({ id: user.id });
  }

  @UseJwtAuthGuard()
  @Query(() => UserManyResult)
  async users(@Args() args: FindManyUserArgs, @Info() info: GraphQLResolveInfo) {
    const select = new PrismaSelect(info, {
      excludeFields: {
        User: ['fullName']
      }
    }).value;
    const total = await this.prisma.user.count({ where: args.where });
    const data = await this.prisma.user.findMany({ ...args, ...select['select']['data'] });
    return { total, data };
  }

  @Mutation(() => String)
  async changeAvatar(@Args('file', { type: () => GraphQLUpload }) file: FileUpload) {
    const user = await this.prisma.user.findUnique({ where: { id: 1 } });
    if (!user) throw new Error('User not found');

    const { filename } = await file;
    const key = new S3KeyBuilder('users').module('profile').build(user.id, filename, 'avatar');
    const preSignedUrl = this.s3.getSignedUrl(key, 'put', { acl: 'public-read' });

    await this.prisma.user.update({ where: { id: user.id }, data: { avatar: key } });

    return preSignedUrl;
  }
}
