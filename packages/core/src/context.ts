import type { GenerationType } from './types.js';

import { formatDate, toPosixPath } from './functions.js';

type InitParams = {
  fsPath: string;
  path: string;
  type: GenerationType;
};
type OutputChannel = { log: (...values: string[]) => void };

type WriteInfoParams = {
  path: string;
  fileCount: number;
};

export class GeneratorContext {
  public customBarrelName?: string;
  get activePath() {
    if (!this.path || !this.fsPath) {
      throw new Error('Context.activePath called when no active path');
    }

    return { fsPath: this.fsPath, path: this.path };
  }

  get activeType(): GenerationType {
    if (!this.type) {
      throw new Error('Context.activeType called when no active type');
    }

    return this.type;
  }

  get packageName(): string {
    if (!this.path || !this.fsPath) {
      throw new Error('Context.packageName called when no active path');
    }

    const parts = toPosixPath(this.fsPath).split('/lib');
    const path = parts[0].split('/');
    return path[path.length - 1];
  }

  private fsPath?: string;

  private path?: string;

  private startTimestamp?: number;

  private type?: GenerationType;

  constructor(
    private channel: OutputChannel
  ) {
    this.channel.log(
      `[${formatDate()}] DartBarrelFile extension enabled`
    );

    this.reset();
  }

  deactivate() {
    this.channel.log(
      `[${formatDate()}] DartBarrelFile extension disabled`
    );
  }

  endGeneration(): void {
    if (!this.startTimestamp) {
      throw new Error(
        'Context.endGeneration cannot be called before Context.initGeneration'
      );
    }

    this.channel.log(
      `[${formatDate()}] Elapsed time: ${new Date(
        Date.now() - this.startTimestamp
      ).getMilliseconds()}ms`
    );

    this.reset();
  }

  initGeneration({ fsPath, path, type }: InitParams): void {
    const ts = new Date();
    this.startTimestamp = ts.getTime();

    this.channel.log(
      `[${formatDate()}] Generation started ${formatDate(ts)}`
    );

    this.path = path;
    this.fsPath = fsPath;
    this.type = type;

    this.channel.log(
      `[${formatDate()}] Type: ${type ? 'recursive' : 'regular'} - Path: ${
        fsPath
      }`
    );
  }

  onError(error: any): void {
    this.channel.log(`[${formatDate()}] ERROR: ${error}`);
  }

  writeFolderInfo({ fileCount, path }: WriteInfoParams) {
    this.channel.log(
      `[${formatDate()}] Exporting ${path} - found ${fileCount} Dart files`
    );
  }

  writeGeneratedInfo(path: string): void {
    this.channel.log(
      `[${formatDate()}] Generating barrel file at ${path}`
    );
  }

  writeSuccessfullInfo(path: string): void {
    this.channel.log(
      `[${formatDate()}] Generated successfull barrel file at ${path}`
    );
  }

  private reset() {
    this.startTimestamp = undefined;
    this.path = undefined;
    this.type = undefined;
    this.customBarrelName = undefined;
  }
}
