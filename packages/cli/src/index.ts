/* eslint-disable node/prefer-global/process */

import type { GenerationType } from '@dbf/core';

import { program } from 'commander';
import fs from 'node:fs';
import path from 'node:path';
import * as v from 'valibot';

import { GeneratorContext } from '@dbf/core';

import { description, name as packageName, version } from '../package.json';

const Context = new GeneratorContext({
  log: console.log
});
const Directory = v.string('Provided directory should be a string');

const validateAndGenerate = () => {};

export const run = async (directory: Directory, type: GenerationType) => {
  Context.initGeneration({ fsPath: uri.fsPath, path: uri.path, type });

  if (!Context.activeType) {
    Context.onError(
      'Extension did not launch properly. Create an issue if this error persists'
    );
    Context.endGeneration();

    window.showErrorMessage('GBDF: Error on initialising the extension');
  }

  try {
    const maybeGenerated = await validateAndGenerate();

    if (maybeGenerated) {
      console.log('GDBF: Generated files!', maybeGenerated);
    } else {
      console.log('GDBF: No dart barrel file has been generated!');
    }

    Context.endGeneration();
  } catch (error: any) {
    Context.onError(error);
    Context.endGeneration();

    console.log('GDBF: Error on generating the file', error);
  }
};

program
  .name(packageName)
  .description(description)
  .version(version);

program
  .command('g')
  .description('Generate barrel file for specified directory')
  .argument('<directory>', 'Target directory for barrel file generation')
  .action(async (directory) => {
    const dir = v.parse(Directory, directory);

    try {
      const resolvedPath = path.resolve(dir);
      if (!fs.existsSync(resolvedPath)) {
        console.error(`Error: Directory does not exist: ${resolvedPath}`);
        process.exit(1);
      }

      await generateBarrelFiles(resolvedPath, GenerationType.REGULAR);
      console.log(`Successfully generated barrel file for ${resolvedPath}`);
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  });

program
  .command('subfolders')
  .description('Generate barrel file including subfolders for specified directory')
  .argument('<directory>', 'Target directory for barrel file generation')
  .action(async (directory) => {
    try {
      const resolvedPath = path.resolve(directory);
      if (!fs.existsSync(resolvedPath)) {
        console.error(`Error: Directory does not exist: ${resolvedPath}`);
        process.exit(1);
      }

      await run(resolvedPath, GenerationType.REGULAR_SUBFOLDERS);
      console.log(`Successfully generated barrel file with subfolders for ${resolvedPath}`);
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  });

program
  .command('recursive')
  .description('Generate barrel files for current directory and all nested directories')
  .argument('<directory>', 'Target directory for barrel file generation')
  .action(async (directory) => {
    try {
      const resolvedPath = path.resolve(directory);
      if (!fs.existsSync(resolvedPath)) {
        console.error(`Error: Directory does not exist: ${resolvedPath}`);
        process.exit(1);
      }

      await generateBarrelFiles(resolvedPath, GenerationType.RECURSIVE);
      console.log(`Successfully generated recursive barrel files for ${resolvedPath}`);
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  });

// TODO: Decide if focused should be implemented

program.parse();
