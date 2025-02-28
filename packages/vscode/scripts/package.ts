#!/usr/bin/env bun

import chalk from 'chalk';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const logPrefix = chalk.bgBlueBright.black(' INFO ');
const okPrefix = chalk.bgGreen.black(' OK ');

// eslint-disable-next-line node/prefer-global/process
const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

console.log(
  `${logPrefix} Found name: ${chalk.green(packageJson.name)}, temporarily renaming to: ${chalk.green('dart-barrel-file-generator')}\n`
);

const tempName = packageJson.name;
packageJson.name = 'dart-barrel-file-generator';
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log(`${logPrefix} Packaging extension...\n`);
execSync('bun vsce package --no-dependencies --skip-license', { stdio: 'inherit' });

console.log(`\n${logPrefix} Restoring ${chalk.green('package.json')} name to ${chalk.green(tempName)}...`);
packageJson.name = tempName;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log(`${okPrefix} Done!`);
