import * as fs from 'fs';

import { isDirectory } from '../../helper';
import { GeneratedGqlParserExecutorSchema } from './schema';

export default async function runExecutor(_options: GeneratedGqlParserExecutorSchema) {
  const generatedSrc = 'libs/generated/src/graphql';

  const models = fs.readdirSync(generatedSrc);
  models.forEach((dir) => {
    const isDir = isDirectory(`${generatedSrc}/${dir}`);
    if (isDir) {
      const files = fs.readdirSync(`${generatedSrc}/${dir}`);
      const removeSyntax = ['create', 'update', 'delete', 'upsert', 'first', 'index'];

      const removeFiles = files.filter((file) => removeSyntax.some((syntax) => file.includes(syntax)));
      const keepFiles = files.filter((file) => !removeSyntax.some((syntax) => file.includes(syntax)));

      removeFiles.forEach((file) => fs.unlinkSync(`${generatedSrc}/${dir}/${file}`));

      // create index.ts to export keepFiles
      const indexContent = keepFiles.map((file) => `export * from './${file.replace('.ts', '')}';`).join('\n');
      fs.writeFileSync(`${generatedSrc}/${dir}/index.ts`, indexContent + '\n');
    }
  });

  // create index.ts at root of generatedSrc
  let indexContent = '';
  models.map((model) => {
    if (model !== 'index.ts') {
      indexContent += `export * from './${model}';\n`;
    }
  });
  fs.writeFileSync(`${generatedSrc}/index.ts`, indexContent);

  return {
    success: true
  };
}
