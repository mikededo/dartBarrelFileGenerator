import { OutputChannel, Uri, window } from 'vscode';

import { GenerationType } from './types';
import { formatDate, toPosixPath } from './functions';

type InitParms = {
  type: GenerationType;
  path: Uri;
};

type WriteInfoParams = {
  path: string;
  fileCount: number;
};

class GeneratorContext {
  private channel: OutputChannel;
  private path?: Uri;
  private type?: GenerationType;
  private startTimestamp?: number;

  public customBarrelName?: string;

  constructor() {
    this.channel = window.createOutputChannel('DartBarrelFile');

    this.channel.appendLine(
      `[${formatDate()}] DartBarrelFile extension enabled`
    );

    this.reset();
  }

  private reset() {
    this.startTimestamp = undefined;
    this.path = undefined;
    this.type = undefined;
    this.customBarrelName = undefined;
  }

  get activePath(): Uri {
    if (!this.path) {
      throw new Error('Context.activePath called when no active path');
    }

    return this.path;
  }

  get activeType(): GenerationType {
    if (!this.type) {
      throw new Error('Context.activeType called when no active type');
    }

    return this.type;
  }

  get packageName(): string {
    if (!this.path) {
      throw new Error('Context.packageName called when no active path');
    }

    const parts = toPosixPath(this.activePath.fsPath).split('/lib');
    const path = parts[0].split('/');
    return path[path.length - 1];
  }

  initGeneration({ path, type }: InitParms): void {
    const ts = new Date();
    this.startTimestamp = ts.getTime();

    this.channel.appendLine(
      `[${formatDate()}] Generation started ${formatDate(ts)}`
    );

    this.path = path;
    this.type = type;

    this.channel.appendLine(
      `[${formatDate()}] Type: ${type ? 'recursive' : 'regular'} - Path: ${
        path.fsPath
      }`
    );
  }

  endGeneration(): void {
    if (!this.startTimestamp) {
      throw new Error(
        'Context.endGeneration cannot be called before Context.initGeneration'
      );
    }

    this.channel.appendLine(
      `[${formatDate()}] Elapsed time: ${new Date(
        Date.now() - this.startTimestamp
      ).getMilliseconds()}ms`
    );

    this.reset();
  }

  onError(error: any): void {
    this.channel.appendLine(`[${formatDate()}] ERROR: ${error}`);
  }

  deactivate() {
    this.channel.appendLine(
      `[${formatDate()}] DartBarrelFile extension disabled`
    );
    this.channel.dispose();
  }

  writeFolderInfo({ path, fileCount }: WriteInfoParams) {
    this.channel.appendLine(
      `[${formatDate()}] Exporting ${path} - found ${fileCount} Dart files`
    );
  }

  writeGeneratedInfo(path: string): void {
    this.channel.appendLine(
      `[${formatDate()}] Generating barrel file at ${path}`
    );
  }

  writeSuccessfullInfo(path: string): void {
    this.channel.appendLine(
      `[${formatDate()}] Generated successfull barrel file at ${path}`
    );
  }
}

const ctx = new GeneratorContext();

export default ctx;
export { GeneratorContext };
