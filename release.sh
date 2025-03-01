#! /usr/bin/bash
bun run --cwd packages/vscode package --ci
bun changeset publish
bun vsce publish --packagePath ./extension.vsix
