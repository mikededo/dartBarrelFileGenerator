export type FocusedGenerations = 'REGULAR_FOCUSED';
export type GenerationConfiguration = {
  excludedDirs: string[];
  excludedFiles: string[];
  excludeFreezed: boolean;
  excludeGenerated: boolean;
};
export type GenerationType = FocusedGenerations | RegularGenerations;
export type Maybe<T> = T | undefined;
export type RegularGenerations =
  | 'RECURSIVE'
  | 'REGULAR_SUBFOLDERS'
  | 'REGULAR';
