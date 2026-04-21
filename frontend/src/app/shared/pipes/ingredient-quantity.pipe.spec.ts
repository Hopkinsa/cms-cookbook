import { IngredientQuantityPipe } from './ingredient-quantity.pipe';

describe('IngredientQuantityPipe', () => {
  const pipe = new IngredientQuantityPipe();

  it('formats imperial quantities as cookbook fractions', () => {
    expect(pipe.transform(1.5, 'cup')).toBe('1 1/2');
    expect(pipe.transform(0.333, 'cup')).toBe('1/3');
    expect(pipe.transform(1.102, 'lb')).toBe('1 1/8');
  });

  it('formats metric quantities as decimals', () => {
    expect(pipe.transform(473.176, 'ml')).toBe('473.18');
    expect(pipe.transform(1.25, 'kg')).toBe('1.25');
  });

  it('returns an empty string for nullish values', () => {
    expect(pipe.transform(null, 'cup')).toBe('');
    expect(pipe.transform(undefined, 'cup')).toBe('');
  });
});
