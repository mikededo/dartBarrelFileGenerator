import { FILE_REGEX } from '../../helpers/constants';

describe('constants', () => {
  describe('FILE_REGEX', () => {
    describe('#dart', () => {
      it('should return a RegExp', () => {
        expect(FILE_REGEX.dart).toBeInstanceOf(RegExp);
      });

      it('should return true if file is a dart file', () => {
        expect(FILE_REGEX.dart.test('main.dart')).toBeTruthy();
      });

      it('should return false if file not a dart file', () => {
        expect(FILE_REGEX.dart.test('main.js')).toBeFalsy();
      });
    });

    describe('#suffixed', () => {
      it('should return a RegExp', () => {
        expect(FILE_REGEX.suffixed('freezed')).toBeInstanceOf(RegExp);
      });

      it('should return true if file suffixed with freezed', () => {
        expect(
          FILE_REGEX.suffixed('freezed').test('file.freezed.dart')
        ).toBeTruthy();
      });

      it('should return false if file not suffixed with freezed', () => {
        expect(FILE_REGEX.suffixed('freezed').test('file.g.dart')).toBeFalsy();
      });
    });

    describe('#base', () => {
      it('should return a RegExp', () => {
        expect(FILE_REGEX.base('main')).toBeInstanceOf(RegExp);
      });

      it('should return true if file has the same name as the folder barrel file', () => {
        expect(FILE_REGEX.base('widgets').test('widgets.dart')).toBeTruthy();
      });

      it('should return true if file does not have the same name as the folder barrel file', () => {
        expect(FILE_REGEX.base('widgets').test('AppBar.dart')).toBeFalsy();
      });
    });
  });
});
