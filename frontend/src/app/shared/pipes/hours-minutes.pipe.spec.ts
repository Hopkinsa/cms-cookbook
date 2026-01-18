import { HoursMinutesPipe } from './hours-minutes.pipe';

describe('HoursMinutesPipe', () => {
  const pipe = new HoursMinutesPipe();

  it('should return empty string for 0 minutes', () => {
    expect(pipe.transform('0')).toBe('');
  });

  it('should format minutes under an hour', () => {
    expect(pipe.transform('45')).toBe('45 minutes');
  });

  it('should format exact hours', () => {
    expect(pipe.transform('60')).toBe('1 hour ');
    expect(pipe.transform('120')).toBe('2 hours ');
  });

  it('should format hours and minutes together', () => {
    expect(pipe.transform('75')).toBe('1 hour 15 minutes');
  });
});
