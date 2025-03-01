#! /usr/bin/bash
bun run --cwd packages/vscode package --ci
bun vsce publish --packagePath ./extension.vsix
