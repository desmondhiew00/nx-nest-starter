import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { IntFilter } from '../prisma/int-filter.input';
import { StringFilter } from '../prisma/string-filter.input';
import { BoolFilter } from '../prisma/bool-filter.input';
import { IntNullableFilter } from '../prisma/int-nullable-filter.input';
import { DateTimeFilter } from '../prisma/date-time-filter.input';
import { DateTimeNullableFilter } from '../prisma/date-time-nullable-filter.input';
import { UserNullableRelationFilter } from '../user/user-nullable-relation-filter.input';

@InputType()
export class PostWhereInput {
  @Field(() => [PostWhereInput], { nullable: true })
  AND?: Array<PostWhereInput>;

  @Field(() => [PostWhereInput], { nullable: true })
  OR?: Array<PostWhereInput>;

  @Field(() => [PostWhereInput], { nullable: true })
  NOT?: Array<PostWhereInput>;

  @Field(() => IntFilter, { nullable: true })
  id?: IntFilter;

  @Field(() => StringFilter, { nullable: true })
  title?: StringFilter;

  @Field(() => StringFilter, { nullable: true })
  content?: StringFilter;

  @Field(() => BoolFilter, { nullable: true })
  published?: BoolFilter;

  @Field(() => IntNullableFilter, { nullable: true })
  authorId?: IntNullableFilter;

  @Field(() => DateTimeFilter, { nullable: true })
  createdAt?: DateTimeFilter;

  @Field(() => DateTimeFilter, { nullable: true })
  updatedAt?: DateTimeFilter;

  @Field(() => DateTimeNullableFilter, { nullable: true })
  deletedAt?: DateTimeNullableFilter;

  @Field(() => UserNullableRelationFilter, { nullable: true })
  author?: UserNullableRelationFilter;
}
