import _ from 'lodash';
import { OutputChannel, Uri, window } from 'vscode';

import { GEN_TYPE } from './constants';
import { formatDate } from './functions';

type InitParms = {
    type: GEN_TYPE;
    path: Uri;
};

type WriteInfoParams = {
    path: string;
    fileCount: number;
};

class GeneratorContext {
    private channel: OutputChannel;
    private path?: Uri;
    private type?: GEN_TYPE;
    private startTimestamp?: number;

    constructor(channelName: string = 'DartBarrelFile') {
        this.channel = window.createOutputChannel(channelName);

        this.channel.appendLine(
            `[${formatDate()}] DartBarrelFile extension enabled`
        );

        this.reset();
    }

    private reset() {
        this.startTimestamp = undefined;
        this.path = undefined;
        this.type = undefined;
    }

    get activePath(): Uri {
        if (_.isNil(this.path)) {
            throw new Error('Context.activePath called when no active path');
        }

        return this.path;
    }

    get activeType(): GEN_TYPE {
        if (_.isNil(this.type)) {
            throw new Error('Context.activeType called when no active type');
        }

        return this.type;
    }

    initGeneration({ path, type }: InitParms): void {
        const ts = new Date();
        this.startTimestamp = ts.getTime();

        this.channel.appendLine(
            `[${formatDate()}] Geneartion started ${formatDate(ts)}`
        );

        this.path = path;
        this.type = type;

        this.channel.appendLine(
            `[${formatDate()}] Type: ${
                type ? 'recursive' : 'regular'
            } - Path: ${path.fsPath}`
        );
    }

    endGeneration(): void {
        if (_.isNil(this.startTimestamp)) {
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
