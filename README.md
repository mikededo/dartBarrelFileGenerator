# Dart Barrel File Generator

VSCode extension that generate barrel files for folders containing dart files.

## Installation

Dart Barrel File Generator either by [searching for the extension in VSCode](https://code.visualstudio.com/docs/editor/extension-gallery#_search-for-an-extension) or from the [marketplace](https://marketplace.visualstudio.com/).

## Overview

It can create barrel files only two the selected folder

![current-and-only-demo](https://raw.githubusercontent.com/mikededo/dartBarrelFileGenerator/master/assets/current-only.gif)

It creates as well barrel files for the selected folder and all the nested folders from the selected. Likewise, it also adds the nested folder barrel file to its parent barrel file.

![current-and-nested-demo](https://raw.githubusercontent.com/mikededo/dartBarrelFileGenerator/master/assets/current-and-nested.gif)

## Commands

| Command                            | Description                                                   |
| ---------------------------------- | ------------------------------------------------------------- |
| `GDBF: Current Folder Only`        | Creates a barrel file for the selected folder                 |
| `GDBF: Current and Nested Folders` | Creates a barrel file for the selected and its nested folders |

Both commands can be used by typing in the command palette. It will then ask you to choose a folder. If it is done from the folder tree, it will use the selected folder as the root folder.

## Options

### Excluding files

You can also exclude `.freezed.dart` and `.g.dart` (generated) files by modifying the following options in your settings:

- `dartBarrelFileGenerator.excludeFreezed: false` (by default).
- `dartBarrelFileGenerator.excludeGenerated: false` (by default).

You can exclude files from being added to a barrel file. Create a list of glob file patterns to exclude with the `dartBarrelFileGenerator.excludeFileList`.

Similarly, you can exclude a directory from having a barrel file generated. Create a list of glob directory patterns to exclude with the `dartBarrelFileGenerator.excludeDirList`.

### Custom file name

By default, the extension will create a new file named as the folder name, appended by the `.dart` extension. However, if you want to set the name, you can activate the following option:

- `dartBarrelFileGenerator.promptName: false` (by default).

Whenever you create a new barrel file, a prompt will appear to ask for the file name. It only works when creating a barrel file for a single folder, since it does not have much sense having it for the other option.

> **Note**: When entering the name, the `.dart` extension is not required.

## Attributions

Extension icon made by [Freepik](https://www.flaticon.com/authors/freepik) from [flaticon](www.flaticon.com).
