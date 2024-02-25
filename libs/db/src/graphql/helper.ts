/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-explicit-any */
import { Field, Int, ObjectType } from '@nestjs/graphql';

type Class = new (...args: any[]) => any;
export const CreateFindManyResultType = <TItem>(TItemClass: any): Class => {
  @ObjectType({ isAbstract: true })
  class FindManyResultClass {
    @Field(() => Int)
    // @ts-ignore
    total: number;

    @Field(() => [TItemClass])
    // @ts-ignore
    data: TItem[];
  }

  Object.defineProperty(FindManyResultClass, 'name', { value: `${TItemClass.name}FindManyResult` });
  return FindManyResultClass;
};
