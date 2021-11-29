import glob from 'glob';
import Mocha from 'mocha';
import path from 'path';

export function run(): Promise<void> {
  const mocha = new Mocha({
    ui: 'bdd',
    color: true
  });

  const testsRoot = path.resolve(__dirname, '..');

  return new Promise((res, rej) => {
    glob('**/**.spec.js', { cwd: testsRoot }, (err, files) => {
      if (err) {
        return rej(err);
      }

      // Add files to the test suite
      files.forEach((f) => mocha.addFile(path.resolve(testsRoot, f)));

      try {
        // Run the mocha test
        mocha.run((failures: number) => {
          if (failures > 0) {
            rej(new Error(`${failures} tests failed.`));
          } else {
            res();
          }
        });
      } catch (err) {
        console.error(err);
        rej(err);
      }
    });
  });
}
