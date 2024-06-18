import { formatFiles, generateFiles, Tree } from '@nx/devkit';
import { camelCase, pascalCase } from 'case-anything';
import chalk from 'chalk';
import inquirer from 'inquirer';
import * as path from 'path';
import pluralize from 'pluralize';
import signale from 'signale';
import { Project, ts } from 'ts-morph';

import { getDirectories } from '../../helper';
import { QueryGeneratorGeneratorSchema } from './schema';

export async function queryGeneratorGenerator(tree: Tree, options?: QueryGeneratorGeneratorSchema) {
  const forceMode = options?.force || false;
  const apps = await getDirectories('apps', []);
  let models = await getDirectories('libs/generated/src/graphql', ['prisma']);

  const { appName } = await inquirer.prompt([
    {
      type: 'list',
      name: 'appName',
      message: 'Select which app to generate the graphql queries for:',
      choices: apps
    }
  ]);

  const { targetModel } = await inquirer.prompt([
    {
      type: 'list',
      name: 'targetModel',
      message: 'Which model do you want to generate the graphql queries for:',
      choices: [...models, 'All']
    }
  ]);

  signale.start(`Generating graphql queries for ${chalk.green(targetModel)} in ${chalk.blue(appName)}`);
  signale.info(`Selected model: ${chalk.green(targetModel)}`);

  const gqlImportSrc = '@generated/graphql';
  const prismaClientImportSrc = '@app/db';
  const projectRoot = `apps/${appName}`;
  const targetDir = path.join(projectRoot, 'src/modules');
  const templateFiles = path.join(__dirname, 'files');
  const appModulePath = path.join(projectRoot, 'src/app.module.ts');

  // Generate module, resolver and service
  if (targetModel !== 'All') {
    models = [targetModel];
  } else if (forceMode) {
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: `Generate graphql queries for all models with --force option will replace all existing files. Are you sure?`
      }
    ]);
    if (!confirm) {
      signale.error('Cancelled');
      return;
    }
  }

  await Promise.all(
    models.map(async (modelName) => {
      if (!forceMode) {
        const checkIsExists = tree.exists(`${targetDir}/${modelName}`);
        if (checkIsExists) {
          signale.warn(`Module for ${chalk.green(modelName)} already exists. Skipping...`);
          return;
        }
      }

      const fileData = {
        modelName,
        gqlImportSrc,
        prismaClientImportSrc,
        withAuth: options.withAuth,
        camelCase,
        pascalCase,
        plural: (val: string) => pluralize.plural(camelCase(val)),
        singular: (val: string) => pluralize.singular(camelCase(val))
      };
      generateFiles(tree, templateFiles, targetDir, fileData);
      await formatFiles(tree);
    })
  );

  // Update app.module.ts (imports and module registration)

  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(appModulePath);
  if (!sourceFile) {
    signale.error(`Could not find ${chalk.blue('app.module.ts')}`);
    return;
  }

  const moduleDecorator = sourceFile.getClass('AppModule').getDecorator('Module');
  const importsProperty = moduleDecorator
    .getArguments()[0]
    .asKind(ts.SyntaxKind.ObjectLiteralExpression)
    .getProperty('imports')
    .getChildrenOfKind(ts.SyntaxKind.ArrayLiteralExpression)[0];

  models.map((modelName) => {
    const moduleName = `${pascalCase(modelName)}Module`;
    sourceFile.getImportDeclaration(`./modules/${modelName}/${modelName}.module`)?.remove();
    sourceFile.addImportDeclaration({
      moduleSpecifier: `./modules/${modelName}/${modelName}.module`,
      namedImports: [moduleName]
    });

    let duplicatedIndex = null;
    importsProperty.getElements().map((element, index) => {
      if (moduleName === element.getFullText().trim()) {
        duplicatedIndex = index;
      }
    });
    if (duplicatedIndex !== null) importsProperty.removeElement(duplicatedIndex);
    importsProperty.addElement(`${pascalCase(modelName)}Module`);
  });

  tree.write(appModulePath, sourceFile.getFullText());
  await formatFiles(tree);
}

export default queryGeneratorGenerator;
