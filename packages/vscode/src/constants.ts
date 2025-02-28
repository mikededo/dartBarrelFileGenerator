import type { OpenDialogOptions } from 'vscode';

export const CONFIGURATIONS = {
  input: {
    canSelectFiles: false,
    canSelectFolders: true,
    canSelectMany: false,
    openLabel: 'Select the folder in which you want to create the barrel file'
  } as Partial<OpenDialogOptions>,
  key: 'dartBarrelFileGenerator',
  values: {
  }
};
export type VSCodeConfigKeyToValue = {
  defaultBarrelName: string;
  excludeDirList: string[];
  excludeFileList: string[];
  excludeFreezed: boolean;
  excludeGenerated: boolean;
  skipEmpty: boolean;
  appendFolderName: boolean;
  prependFolderName: boolean;
  prependPackageToLibExport: boolean;
  promptName: boolean;
};
export type VSCodeConfigurationKeys = keyof VSCodeConfigKeyToValue;
