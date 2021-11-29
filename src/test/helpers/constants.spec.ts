import assert from 'assert';

import { FILE_REGEX } from '../../helpers/constants';

describe('constants', () => {
  describe('FILE_REGEX', () => {
    describe('#dart', () => {
      it('should return a RegExp', () => {
        assert.ok(FILE_REGEX.dart instanceof RegExp);
      });

      it('should return true if file is a dart file', () => {
        assert.ok(FILE_REGEX.dart.test('main.dart'));
      });

      it('should return false if file not a dart file', () => {
        assert.ok(!FILE_REGEX.dart.test('main.js'));
      });
    });

    describe('#suffixed', () => {
      it('should return a RegExp', () => {
        assert.ok(FILE_REGEX.suffixed('freezed') instanceof RegExp);
      });

      it('should return true if file suffixed with freezed', () => {
        assert.ok(FILE_REGEX.suffixed('freezed').test('file.freezed.dart'));
      });

      it('should return false if file not suffixed with freezed', () => {
        assert.ok(!FILE_REGEX.suffixed('freezed').test('file.g.dart'));
      });
    });

    describe('#base', () => {
      it('should return a RegExp', () => {
        assert.ok(FILE_REGEX.base('main') instanceof RegExp);
      });

      it('should return true if file has the same name as the folder barrel file', () => {
        assert.ok(FILE_REGEX.base('widgets').test('widgets.dart'));
      });

      it('should return true if file does not have the same name as the folder barrel file', () => {
        assert.ok(!FILE_REGEX.base('widgets').test('AppBar.dart'));
      });
    });
  });
});
