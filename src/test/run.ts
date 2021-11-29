import path from 'path';

import { runTests } from '@vscode/test-electron';

(async () => {
  try {
    const extensionDevelopmentPath = path.resolve(__dirname, '../../');
    const extensionTestsPath = path.resolve(__dirname, './suite.ts');

    await runTests({ extensionDevelopmentPath, extensionTestsPath });
  } catch (err) {
    console.log('Failed to run tests');
    console.log(err);
    process.exit(1);
  }
})();
