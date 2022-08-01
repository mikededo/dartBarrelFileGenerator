# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [3.0.5](https://github.com/mikededo/dartBarrelFileGenerator/compare/v3.0.4...v3.0.5) (2022-08-01)

### [3.0.4](https://github.com/mikededo/dartBarrelFileGenerator/compare/v3.0.3...v3.0.4) (2022-08-01)

### [3.0.3](https://github.com/mikededo/dartBarrelFileGenerator/compare/v3.0.2...v3.0.3) (2022-08-01)

### [3.0.2](https://github.com/mikededo/dartBarrelFileGenerator/compare/v3.0.1...v3.0.2) (2022-07-08)

### [3.0.1](https://github.com/mikededo/dartBarrelFileGenerator/compare/v3.0.0...v3.0.1) (2022-07-08)

## [3.0.0](https://github.com/mikededo/dartBarrelFileGenerator/compare/v2.0.0...v3.0.0) (2022-07-01)

### ⚠ BREAKING CHANGES

- add exclusion of directory paths from having a barrel file generated (#23)

### Features

- add exclusion of directory paths from having a barrel file generated ([#23](https://github.com/mikededo/dartBarrelFileGenerator/issues/23)) ([018d921](https://github.com/mikededo/dartBarrelFileGenerator/commit/018d921a66150c859a0403aa6b9ed604e4ed1470))
- removed .github workflows ([7968cba](https://github.com/mikededo/dartBarrelFileGenerator/commit/7968cba66df408188a467c627a540644d0ddfb67))

### Bug Fixes

- incorrect usage of `.` in regexp ([9663d7a](https://github.com/mikededo/dartBarrelFileGenerator/commit/9663d7a0b7770c94572f077c664410f50d298eb8))

## 2.1.0

- Updated versions.
- Fixed incorrect usage of RegExp's ([#21](https://github.com/mikededo/dartBarrelFileGenerator/issues/16)).

## 2.0.1

- Updated versions.

## 2.0.0

- Migrated code to TypeScript.
- Added bundler to drastically reduce extension size.
- Added configuration to exclude custom file patterns.

## 1.4.0

- Add option to prompt for the barrel file name when generating a barrel file for a folder ([#16](https://github.com/mikededo/dartBarrelFileGenerator/issues/16)).

## 1.3.1

- Fix files not exporting when suffixed with folder name ([#10](https://github.com/mikededo/dartBarrelFileGenerator/issues/10))

## 1.3.0

- Fix `1.2.1` on Windows OS

## 1.2.1

- Fixed file export when two folders are named the same ([#7](https://github.com/mikededo/dartBarrelFileGenerator/issues/7))

## 1.2.0

- Added file exclusion for generated files.
  - Files type excluded are `.g.dart` and `.freezed.dart`
  - Enabled by default, it can be toggled in the configuration folder.
- Added LICENSE file

## 1.1.0

- Fixed recursive function arguments

## 1.0.3

- Fixed `lodash` dependency missing

## 1.0.2

- Added `Changelog.MD`

## 1.0.1

- Fixed platform specific path bug not initializing the extension

## 0.0.2

- Bug Fixing

## 0.0.1

- Initial release of the extension
