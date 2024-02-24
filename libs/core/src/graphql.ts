import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { PrismaClient } from '@prisma/client';

export class GqlModule {
  static forRoot(prisma: PrismaClient, config?: ApolloDriverConfig) {
    return GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      sortSchema: false,
      csrfPrevention: false,
      context: ({ req, res }: never) => ({ req, res, prisma }),
      formatError: (error) => {
        return { message: error.message };
      },
      ...config,
    });
  }
}
