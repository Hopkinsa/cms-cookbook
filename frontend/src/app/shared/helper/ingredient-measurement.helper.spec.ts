import { IIngredients, IUnits } from '@server/core/interface';

import { getIngredientMeasurementDisplay } from './ingredient-measurement.helper';

const units: IUnits[] = [
  { id: 0, title: '', unit: '---', abbreviation: '' },
  { id: 3, title: 'Imperial Volume', unit: 'Cup', abbreviation: 'cup' },
  { id: 9, title: 'Imperial Weight', unit: 'Pound', abbreviation: 'lb' },
  { id: 10, title: 'Metric Volume', unit: 'Milliliter', abbreviation: 'ml' },
  { id: 11, title: 'Metric Volume', unit: 'Liter', abbreviation: 'l' },
  { id: 13, title: 'Metric Weight', unit: 'Gram', abbreviation: 'g' },
];

describe('getIngredientMeasurementDisplay', () => {
  it('keeps the stored measurement in original mode while applying serves scaling', () => {
    const ingredient: IIngredients = {
      is_title: false,
      ingredient: 'Milk',
      preparation: '',
      quantity: 2,
      quantity_unit: 3,
    };

    const result = getIngredientMeasurementDisplay(ingredient, units, 'original', 1.5);

    expect(result.quantity).toBe(3);
    expect(result.unitAbbreviation).toBe('cup');
  });

  it('converts imperial volume to metric units', () => {
    const ingredient: IIngredients = {
      is_title: false,
      ingredient: 'Milk',
      preparation: '',
      quantity: 2,
      quantity_unit: 3,
    };

    const result = getIngredientMeasurementDisplay(ingredient, units, 'metric');

    expect(result.quantity).toBeCloseTo(473.176, 3);
    expect(result.unitAbbreviation).toBe('ml');
  });

  it('converts metric weight to imperial units', () => {
    const ingredient: IIngredients = {
      is_title: false,
      ingredient: 'Flour',
      preparation: '',
      quantity: 500,
      quantity_unit: 13,
    };

    const result = getIngredientMeasurementDisplay(ingredient, units, 'imperial');

    expect(result.quantity).toBeCloseTo(1.102, 3);
    expect(result.unitAbbreviation).toBe('lb');
  });

  it('prefers cups over pints for cookbook-style imperial volume display', () => {
    const ingredient: IIngredients = {
      is_title: false,
      ingredient: 'Stock',
      preparation: '',
      quantity: 500,
      quantity_unit: 10,
    };

    const result = getIngredientMeasurementDisplay(ingredient, units, 'imperial');

    expect(result.quantity).toBeCloseTo(2.113, 3);
    expect(result.unitAbbreviation).toBe('cup');
  });

  it('leaves unsupported or unitless ingredients unchanged', () => {
    const ingredient: IIngredients = {
      is_title: false,
      ingredient: 'Eggs',
      preparation: '',
      quantity: 3,
      quantity_unit: 0,
    };

    const result = getIngredientMeasurementDisplay(ingredient, units, 'metric');

    expect(result.quantity).toBe(3);
    expect(result.unitAbbreviation).toBe('');
  });
});
