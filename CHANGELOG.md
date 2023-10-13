# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [6.2.0](https://github.com/mikededo/dartBarrelFileGenerator/compare/v6.1.2...v6.2.0) (2023-10-13)


### Features

* prepend the package name ([#98](https://github.com/mikededo/dartBarrelFileGenerator/issues/98)) ([f8449a1](https://github.com/mikededo/dartBarrelFileGenerator/commit/f8449a1ba4991d4f15b4f83a3709ba2d7bb70d2c))

### [6.1.2](https://github.com/mikededo/dartBarrelFileGenerator/compare/v6.1.1...v6.1.2) (2023-10-13)


### Other

* dump dependencies ([a855be0](https://github.com/mikededo/dartBarrelFileGenerator/commit/a855be03ce5fe58f781f3b3a13d832000ee52db6))

### [6.1.1](https://github.com/mikededo/dartBarrelFileGenerator/compare/v6.1.0...v6.1.1) (2023-03-30)


### Fixes

* security updates ([#95](https://github.com/mikededo/dartBarrelFileGenerator/issues/95)) ([473eda8](https://github.com/mikededo/dartBarrelFileGenerator/commit/473eda8c74599b5d86968d98cb27ae6ab815e2b3))

## [6.1.0](https://github.com/mikededo/dartBarrelFileGenerator/compare/v6.0.0...v6.1.0) (2023-03-29)


### Features

* change options names in menu ([#92](https://github.com/mikededo/dartBarrelFileGenerator/issues/92)) ([8a441ea](https://github.com/mikededo/dartBarrelFileGenerator/commit/8a441ead0ce11903c19be338eafad2eae1b971f9))


### Fixes

* check globs for full file/dir path ([#91](https://github.com/mikededo/dartBarrelFileGenerator/issues/91)) ([e1bae76](https://github.com/mikededo/dartBarrelFileGenerator/commit/e1bae76b6a4ea1b0a848e77f14b0c6c22c9493bf))


### Other

* dump dependencies ([#93](https://github.com/mikededo/dartBarrelFileGenerator/issues/93)) ([f1040f7](https://github.com/mikededo/dartBarrelFileGenerator/commit/f1040f7e37857ad538de261c3ae8adfa1548545d))

## [6.0.0](https://github.com/mikededo/dartBarrelFileGenerator/compare/v5.0.0...v6.0.0) (2023-02-26)


### ⚠ BREAKING CHANGES

* Added a new option that, by default, will skip generated dart barrel files taht do not contain any file. This can be toggled with the option (set to `true` by default): `dartBarrelFileGenerator.skipEmpty` 
* Removed `lodash` dependency as it was used for really simple functions that could
be replaced by simple comparisons

### Features

* exclude empty generated barrel files ([#79](https://github.com/mikededo/dartBarrelFileGenerator/issues/79)) ([79fd0bd](https://github.com/mikededo/dartBarrelFileGenerator/commit/79fd0bd6f7e4b3ea76578d5e3f0ae7833ed8255b))
* remove `lodash` dependency ([#82](https://github.com/mikededo/dartBarrelFileGenerator/issues/82)) ([608c98c](https://github.com/mikededo/dartBarrelFileGenerator/commit/608c98c94b8cfc009cb93908a807a812229ca97d))


### Fixes

* clean package.json ([#80](https://github.com/mikededo/dartBarrelFileGenerator/issues/80)) ([343b78b](https://github.com/mikededo/dartBarrelFileGenerator/commit/343b78b43fd460b86f101e2b7bc19984ed77aa65))


### Other

* display `refactor` commits on changelog ([#83](https://github.com/mikededo/dartBarrelFileGenerator/issues/83)) ([a43027b](https://github.com/mikededo/dartBarrelFileGenerator/commit/a43027bd8c1666ad3657be258b5532d8ad1ce961))
* update outdated readme ([#77](https://github.com/mikededo/dartBarrelFileGenerator/issues/77)) ([38e0d3e](https://github.com/mikededo/dartBarrelFileGenerator/commit/38e0d3e120dae47494c574c7e5834fe8b3e30c09))

## [5.0.0](https://github.com/mikededo/dartBarrelFileGenerator/compare/v4.1.0...v5.0.0) (2022-11-27)


### ⚠ BREAKING CHANGES

* Adds two new configuration options.

- `prependFolderName`: When generating the barrel file, it will add the name of the folder at the beginning of the file generated.
- `appendFolderName`: When generating the barrel file, it will add the name of the folder at the end of the file generated.

### Features

* prepend and append folder name options ([#70](https://github.com/mikededo/dartBarrelFileGenerator/issues/70)) ([80eccba](https://github.com/mikededo/dartBarrelFileGenerator/commit/80eccbab1315cbf1659ff19e7a4ef4c7430db418)), closes [#69](https://github.com/mikededo/dartBarrelFileGenerator/issues/69)


### Other

* use markdownDescription on configuration ([#71](https://github.com/mikededo/dartBarrelFileGenerator/issues/71)) ([2f7816f](https://github.com/mikededo/dartBarrelFileGenerator/commit/2f7816f6467631156221c1cb4ca90860233ccafd))

## [4.1.0](https://github.com/mikededo/dartBarrelFileGenerator/compare/v4.0.0...v4.1.0) (2022-11-09)


### Features

* change renovate `baseBranch` ([5663ac0](https://github.com/mikededo/dartBarrelFileGenerator/commit/5663ac0fe7d19ba8194a6967154bbaf051f31242))
* dump vscode engine version to `^1.73.0` ([38a04a1](https://github.com/mikededo/dartBarrelFileGenerator/commit/38a04a1f797880eda97dd724e729d114b7668b01))


### Bug Fixes

* package naming ([24e216a](https://github.com/mikededo/dartBarrelFileGenerator/commit/24e216a16763af4a7453ff42fd28b0468a56bfe4))

## [4.0.0](https://github.com/mikededo/dartBarrelFileGenerator/compare/v3.0.5...v4.0.0) (2022-08-07)

### ⚠ BREAKING CHANGES

- generate current with subfolders
  - A new option has been implemented that allows the user to create a barrel file from
    the chsoen folder, which will include all subfiles from all subfolders, those without being inside a
    barrel file.
- add `defaultBarrelName` option (#58)

### Features

- add `defaultBarrelName` option ([#58](https://github.com/mikededo/dartBarrelFileGenerator/issues/58)) ([7bfbcd4](https://github.com/mikededo/dartBarrelFileGenerator/commit/7bfbcd411150a48e65233ccc5a67461467b59ad7))
- set custom name for nested folders ([#57](https://github.com/mikededo/dartBarrelFileGenerator/issues/57)) ([c841141](https://github.com/mikededo/dartBarrelFileGenerator/commit/c84114170f1bf29c9e0df5a2fcaab6704b90bc59))

### Bug Fixes

- duplicated file names on `current with subfolders` ([c292e1c](https://github.com/mikededo/dartBarrelFileGenerator/commit/c292e1c30812f9e868b9f19af8be2169ace7be84))

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
