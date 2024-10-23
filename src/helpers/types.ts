export type GenerationType =
  | 'REGULAR'
  | 'REGULAR_FOCUSED'
  | 'REGULAR_SUBFOLDERS'
  | 'RECURSIVE';
export type FocusedGenerations = Extract<GenerationType, 'REGULAR_FOCUSED'>;
export type RegularGenerations = Exclude<GenerationType, FocusedGenerations>;

export type Maybe<T> = T | undefined;
