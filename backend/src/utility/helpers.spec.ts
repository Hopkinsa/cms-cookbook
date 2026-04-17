import { bool2Num, log, num2Bool, routeParamInt, routeParamValue } from './helpers';

describe('helpers', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'info').mockImplementation(() => {});
  });
  afterEach(() => {
    consoleSpy.mockRestore();
  });

  test('num2Bool converts 1 to true and others to false', () => {
    expect(num2Bool(1)).toBe(true);
    expect(num2Bool(0)).toBe(false);
    expect(num2Bool(2)).toBe(false);
  });

  test('bool2Num converts true to 1 and false to 0', () => {
    expect(bool2Num(true)).toBe(1);
    expect(bool2Num(false)).toBe(0);
  });

  test('routeParamValue normalizes express params to a single string', () => {
    expect(routeParamValue('42')).toBe('42');
    expect(routeParamValue(['42', '43'])).toBe('42');
    expect(routeParamValue(undefined)).toBeUndefined();
  });

  test('routeParamInt parses normalized route params as integers', () => {
    expect(routeParamInt('42')).toBe(42);
    expect(routeParamInt(['42', '43'])).toBe(42);
    expect(routeParamInt(undefined)).toBeNaN();
  });

  test('log methods call console.info', () => {
    log.title('a', 'b');
    log.info_lv1('c');
    log.info_lv2('d');
    log.info_lv3('e');
    log.error('f');
    expect(consoleSpy).toHaveBeenCalled();
  });
});
