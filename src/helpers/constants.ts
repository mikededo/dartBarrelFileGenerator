import type { OpenDialogOptions } from 'vscode';
import type { FocusedGenerations, RegularGenerations } from './types';

export const FOCUSED_TO_REGULAR: Record<
  FocusedGenerations,
  RegularGenerations
> = {
  REGULAR_FOCUSED: 'REGULAR'
};

export const CONFIGURATIONS = {
  key: 'dartBarrelFileGenerator',
  values: {
    APPEND_FOLDER: 'appendFolderName',
    APPEND_LIB_PACKAGE: 'prependPackageToLibExport',
    DEFAULT_NAME: 'defaultBarrelName',
    EXCLUDE_DIRS: 'excludeDirList',
    EXCLUDE_FILES: 'excludeFileList',
    EXCLUDE_FREEZED: 'excludeFreezed',
    EXCLUDE_GENERATED: 'excludeGenerated',
    PREPEND_FOLDER: 'prependFolderName',
    PROMPT_NAME: 'promptName',
    SKIP_EMPTY: 'skipEmpty'
  },
  input: {
    canSelectMany: false,
    canSelectFiles: false,
    canSelectFolders: true,
    openLabel: 'Select the folder in which you want to create the barrel file'
  } as Partial<OpenDialogOptions>
};

export const FILE_REGEX = {
  /**
   * Used to check whether the current file name has a
   * dart file extension
   */
  dart: /.+(\.dart)$/,

  /**
   * Used to check whether the current filename has a
   * dart file extension suffixed with the given value
   */
  suffixed: (suffix: string) => new RegExp(`.+(\\.${suffix}\\.dart)$`),

  /**
   * Returns a regex that will match if the filename has
   * the same name as the barrel file of the `folder` param
   *
   * @param {string} folder The folder name
   * @returns {RegExp} The regex
   */
  base: (folder: string): RegExp => new RegExp(`^${folder}\\.dart$`)
};
