# NX Nest Starter Repo

This is a starter repo for a NestJS application using the NX workspace. It is a monorepo that contains a single NestJS application.

- [Nx](https://nx.dev/)
- [NestJS](https://nestjs.com/)
- [Prisma](https://www.prisma.io/)

## Create a new app

To create a new app run `nx g @nx/nest:application --name=apps/api --projectNameAndRootFormat=as-provided`. This will create a new NestJS application in the `apps/api` directory.

## Start the app

To start the development server run `nx serve api`. Open your browser and navigate to <http://localhost:3000/>. Happy coding!

## Step by step

### Define database schema

Define your database schema in the `prisma/schema.prisma` file. This file is used to define the database schema and is used to generate the Prisma client.

### Generate Prisma client

Run `prisma:generate` to generate the Prisma client and graphql schema.

### Generate and Run migrations

Run `yarn prisma:migration:gen` to generate a new migration. This will create a new migration file in the `prisma/migrations` directory. Run `prisma:migration:run` to apply the migration to the database.

### Create and Run Seed Data

Create seed data in the `prisma/seeds` directory. See prisma seed [documentation](https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding) for more information. Run `yarn prisma:seed` to seed the database with data.

## Generate code

If you happen to use Nx plugins, you can leverage code generators that might come with it.

Run `nx list` to get a list of available plugins and whether they have generators. Then run `nx list <plugin-name>` to see what generators are available.

Learn more about [Nx generators on the docs](https://nx.dev/features/generate-code).

### Using NX Console

If you have the Nx Console installed, you can use the UI to generate code. Just right-click on the project and select `Nx: Generate Code`.

## Running tasks

To execute tasks with Nx use the following syntax:

```
nx <target> <project> <...options>
```

You can also run multiple targets:

```
nx run-many -t <target1> <target2>
```

..or add `-p` to filter specific projects

```
nx run-many -t <target1> <target2> -p <proj1> <proj2>
```

Targets can be defined in the `package.json` or `projects.json`. Learn more [in the docs](https://nx.dev/features/run-tasks).

## Want better Editor Integration?

Have a look at the [Nx Console extensions](https://nx.dev/nx-console). It provides autocomplete support, a UI for exploring and running tasks & generators, and more! Available for VSCode, IntelliJ and comes with a LSP for Vim users.

## Ready to deploy?

Just run `nx build demoapp` to build the application. The build artifacts will be stored in the `dist/` directory, ready to be deployed.

## Set up CI

Nx comes with local caching already built-in (check your `nx.json`). On CI you might want to go a step further.

- [Set up remote caching](https://nx.dev/features/share-your-cache)
- [Set up task distribution across multiple machines](https://nx.dev/nx-cloud/features/distribute-task-execution)
- [Learn more how to setup CI](https://nx.dev/recipes/ci)

## Explore the Project Graph

Run `nx graph` to show the graph of the workspace.
It will show tasks that you can run with Nx.

- [Learn more about Exploring the Project Graph](https://nx.dev/core-features/explore-graph)

## Connect with us

- [Join the community](https://nx.dev/community)
- [Subscribe to the Nx Youtube Channel](https://www.youtube.com/@nxdevtools)
- [Follow us on Twitter](https://twitter.com/nxdevtools)
