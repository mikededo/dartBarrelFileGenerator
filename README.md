# Dart Barrel File Generator

VSCode extension that generate barrel files for folders containing dart files.

## Installation

Dart Barrel File Generator either by
[searching for the extension in VSCode](https://code.visualstudio.com/docs/editor/extension-gallery#_search-for-an-extension)
or from the [marketplace](https://marketplace.visualstudio.com/).

## Overview

It can create barrel files only two the selected folder

![current-and-only-demo](https://raw.githubusercontent.com/mikededo/dartBarrelFileGenerator/master/assets/current-only.gif)

It creates a barrel file for the selected folder and all the nested folders from
the selected. Likewise, it also adds the nested folder barrel file to its parent
barrel file.

![current-and-nested-demo](https://raw.githubusercontent.com/mikededo/dartBarrelFileGenerator/master/assets/current-and-nested.gif)

Alternatively, the extension can create a barrel file with all the names of the
nested folders (for each subfolder), without creating additional barrel files.

![current-with-subfolders-demo](https://raw.githubusercontent.com/mikededo/dartBarrelFileGenerator/master/assets/current-with-subfolders.gif)

## Commands

| Command                            | Description                                                   |
| ---------------------------------- | ------------------------------------------------------------- |
| `GDBF: Current Folder Only`        | Creates a barrel file for the selected folder                 |
| `GDBF: Current and Nested Folders` | Creates a barrel file for the selected and its nested folders |

Both commands can be used by typing in the command palette. It will then ask you to
choose a folder. If it is done from the folder tree, it will use the selected
folder as the root folder.

## Options

### Excluding files

You can also exclude `.freezed.dart` and `.g.dart` (generated) files by modifying the
following options in your settings:

- `dartBarrelFileGenerator.excludeFreezed: false` (by default).
- `dartBarrelFileGenerator.excludeGenerated: false` (by default).

It is also possible to exclude glob patterns:

- For files, you can add a list of file globs in the `dartBarrelFile.excludeFileList`
  option.
- For directories, you can add a list of directories globs in the
  `dartBarrelFile.excludeDirList` option.

### Default barrel file name

The extension will create a barrel file with the `<folder-name>.dart` by default. This
behaviour can be changed if the `dartBarrelFileGenerator.defaultBarrelName` option is
set. By changing this option, whenever a barrel file is created, it will use the name
set in the configuration instead of the default.

> **Note**: If the name contains any whitespace, such will be replaced by `_`.

### Custom file name

By default, the extension will create a new file named as the folder name, appended by
the `.dart` extension. However, if you want to set the name, you can activate the
following option:

- `dartBarrelFileGenerator.promptName: false` (by default).

Whenever you create a new barrel file, a prompt will appear to ask for the file name.
It can be used for both options.

> **Note**: When entering the name, the `.dart` extension is not required.

### Other options

- Skipping empty folders: by default, `dartBarrelFileGenerator` will not
  generate a barrel file for a folder that does not have any file to export. You
  can change this behaviour by setting `dartBarrelFileGenerator.skipEmpty` to
  `false`. 

## Attributions

Extension icon made by [Freepik](https://www.flaticon.com/authors/freepik) from [flaticon](www.flaticon.com).
