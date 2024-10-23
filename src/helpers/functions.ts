import { readdirSync } from 'node:fs';
import { posix, sep } from 'node:path';
import { minimatch } from 'minimatch';

import { window, workspace } from 'vscode';

import { CONFIGURATIONS, FILE_REGEX } from './constants';

const path = { sep, posix };

type PosixPath = string;

/**
 * Converts a path to a generic `PosixPath`
 *
 * @param pathLike Path location
 * @returns An equal location with posix separators
 */
export const toPosixPath = (pathLike: string): PosixPath =>
  pathLike.split(path.sep).join(path.posix.sep);

/**
 * Returns the configuration value of the given config value
 *
 * @param name Configuration value name
 * @returns The configuration value if any
 */
export const getConfig = <T = any>(name: string): T | undefined =>
  workspace.getConfiguration().get([CONFIGURATIONS.key, name].join('.'));

export const formatDate = (date: Date = new Date()) =>
  date.toISOString().replace(/T/, ' ').replace(/\..+/, '');

/**
 * Checks if the given target path is the lib folder
 *
 * @param targetPath The barrel file target path
 * @returns If the path is the `lib` folder
 */
export const isTargetLibFolder = (targetPath: string): boolean => {
  const parts = targetPath.split('/');
  return parts[parts.length - 1] === 'lib';
};

/**
 * Converts a `PosixPath` to a OS specific path
 *
 * @param posixPath Current path
 * @returns A location path with os specific separators
 */
export const toOsSpecificPath = (posixPath: PosixPath): string =>
  posixPath.split(path.posix.sep).join(path.sep);

/**
 * Checks if a file is a dart file
 *
 * @param fileName The file name to evaluate
 * @returns If the file name is a valid dart file
 */
export const isDartFile = (fileName: string) => FILE_REGEX.dart.test(fileName);

/**
 * Checks if a file has the name of the current folder barrel file
 *
 * @param dirName The directory name
 * @param fileName The file name to evaluate
 * @returns If the file name equals the name of the
 * barrel file
 */
export const isBarrelFile = (dirName: string, fileName: string) =>
  FILE_REGEX.base(dirName).test(fileName);

/**
 * Checks if the given file name matches the given glob
 *
 * @param fileName The file to check for
 * @param glob The glob to compare the string with
 * @returns Whether it matches the glob or not
 */
export const matchesGlob = (fileName: string, glob: string): boolean =>
  minimatch(fileName, glob);

/**
 * Sorts the file names alphabetically
 */
export const fileSort = (a: string, b: string): number =>
  a < b ? -1 : a > b ? 1 : 0;

/**
 * Shows a vscode dialog to select a folder to create a barrel file to
 *
 * @returns The selected path if any
 */
export const getFolderNameFromDialog = (): Thenable<string | undefined> =>
  window.showOpenDialog(CONFIGURATIONS.input).then(uri =>
    // The selected input is in the first array position
    uri && uri.length > 0
      ? uri[0].path
      : undefined
  );

/**
 * Checks if the given `posixPath` is a dart file, it has a different
 * name than the folder barrel file and is not excluded by any configuration
 *
 * @param fileName File name
 * @param filePath File path
 * @param dirName The current directory name
 * @returns If the given `posixPath` should be added to the list of
 * exports
 */
export const shouldExport = (
  fileName: PosixPath,
  filePath: PosixPath,
  dirName: string
): boolean => {
  if (isDartFile(fileName) && !isBarrelFile(dirName, fileName)) {
    if (FILE_REGEX.suffixed('freezed').test(fileName)) {
      // Export only if files are not excluded
      return !getConfig(CONFIGURATIONS.values.EXCLUDE_FREEZED);
    }

    if (FILE_REGEX.suffixed('g').test(fileName)) {
      // Export only if files are not excluded
      return !getConfig(CONFIGURATIONS.values.EXCLUDE_GENERATED);
    }

    const globs: string[] =
      getConfig(CONFIGURATIONS.values.EXCLUDE_FILES) ?? [];
    return globs.every(glob => !matchesGlob(filePath, glob));
  }

  return false;
};

/**
 * Checks if the given `posixPath` is not excluded by any configuration
 *
 * @param posixPath The path to check
 * @returns If the given `posixPath` should be added to the list of
 * exports
 */
export const shouldExportDirectory = (posixPath: PosixPath): boolean => {
  const globs: string[] = getConfig(CONFIGURATIONS.values.EXCLUDE_DIRS) ?? [];
  return globs.every(glob => !matchesGlob(posixPath, glob));
};

/**
 * Gets the list of files and a set of directories from the given path
 * without the path in the name.
 *
 * @param barrel The name of the barrel file
 * @param path The name of the path to check for
 */
export const getFilesAndDirsFromPath = (
  barrel: string,
  path: string
): [string[], Set<string>] => {
  const files = [];
  const dirs = new Set<string>();

  for (const curr of readdirSync(path, { withFileTypes: true })) {
    const fullPath = `${path}/${curr.name}`;
    if (curr.isFile()) {
      if (shouldExport(curr.name, fullPath, barrel)) {
        files.push(curr.name);
      }
    } else if (curr.isDirectory()) {
      if (shouldExportDirectory(fullPath)) {
        dirs.add(curr.name);
      }
    }
  }

  return [files, dirs];
};

/**
 * Gets the list of all the files from the current path and its
 * nested folders (including all subfolders)
 *
 * @param barrel The name of the barrel file
 * @param path The name of the path to check for
 */
export const getAllFilesFromSubfolders = (
  barrel: string,
  path: string
): string[] => {
  const resultFiles: string[] = [];
  const [files, dirs] = getFilesAndDirsFromPath(barrel, path);

  resultFiles.push(...files);

  if (dirs.size > 0) {
    for (const d of dirs) {
      const folderFiles = getAllFilesFromSubfolders(barrel, `${path}/${d}`);
      resultFiles.push(...folderFiles.map(f => `${d}/${f}`));
    }
  }

  return resultFiles;
};
