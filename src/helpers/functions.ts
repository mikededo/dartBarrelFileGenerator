import { isEmpty, isNil } from 'lodash';
import { sep, posix } from 'path';
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
  window.showOpenDialog(CONFIGURATIONS.input).then((uri) =>
    isNil(uri) || isEmpty(uri)
      ? undefined
      : // The selected input is in the first array position
        uri[0].path
  );

/**
 * Checks if the given `posixPath` is a dart file, it has a different
 * name than the folder barrel file and is not excluded by any configuration
 *
 * @param posixPath The path to check
 * @param dirName The current directory name
 * @returns If the given `posixPath` should be added to the list of
 * exports
 */
export const shouldExport = (
  posixPath: PosixPath,
  dirName: string
): boolean => {
  if (isDartFile(posixPath) && !isBarrelFile(dirName, posixPath)) {
    if (FILE_REGEX.suffixed('freezed').test(posixPath)) {
      // Export only if files are not excluded
      return !getConfig(CONFIGURATIONS.values.EXCLUDE_FREEZED);
    }

    if (FILE_REGEX.suffixed('g').test(posixPath)) {
      // Export only if files are not excluded
      return !getConfig(CONFIGURATIONS.values.EXCLUDE_GENERATED);
    }

    return true;
  }

  return false;
};

/**
 * Returns the configuration value of the given config value
 *
 * @param name Configuration value name
 * @returns The configuration value if any
 */
export const getConfig = (name: string): any | undefined =>
  workspace.getConfiguration().get([CONFIGURATIONS.key, name].join('.'));

export const formatDate = (date: Date = new Date()) =>
  date.toISOString().replace(/T/, ' ').replace(/\..+/, '');
