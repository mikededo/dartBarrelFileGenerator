# Dart Barrel File Generator

VSCode extension that generate barrel files for folders containing dart files.

## Installation

Dart Barrel Fiel generator either by [searching for the extension in VSCode](https://code.visualstudio.com/docs/editor/extension-gallery#_search-for-an-extension) or from the [marketplace](https://marketplace.visualstudio.com/).

## Overview

It can create barrel files only two the selected folder

![current-and-only-demo](https://raw.githubusercontent.com/mikededo/dartBarrelFileGenerator/master/assets/current-only.gif)

It creates aswell barrel files for the selected folder and all the nested folders from the selected. It also adds the nested folder barrel file to its parent barrel file.

![current-and-nested-demo](https://raw.githubusercontent.com/mikededo/dartBarrelFileGenerator/master/assets/current-only.gif)

## Commands

| Command                            | Description                                                   |
| ---------------------------------- | ------------------------------------------------------------- |
| `GDBF: Current Folder Only`        | Creates a barrel file for the selected folder                 |
| `GDBF: Current and Nested Folders` | Creates a barrel file for the selected and its nested folders |

Both commans can be used by typing in the commmand palette. It will then ask you to choose a folder. If it is done from the folder tree, it will use the selected folder as the root folder.

## Attributions

Extension icon made by [Freepik](https://www.flaticon.com/authors/freepik) from [flaticon](www.flaticon.com).
