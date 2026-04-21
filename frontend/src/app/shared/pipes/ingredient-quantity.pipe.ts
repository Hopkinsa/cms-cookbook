import { Pipe, PipeTransform } from '@angular/core';

const IMPERIAL_UNITS = new Set(['tsp', 'tbsp', 'cup', 'qt', 'gal', 'oz', 'lb']);
const FRACTION_STEPS = [
  { value: 0, text: '' },
  { value: 1 / 8, text: '1/8' },
  { value: 1 / 4, text: '1/4' },
  { value: 1 / 3, text: '1/3' },
  { value: 3 / 8, text: '3/8' },
  { value: 1 / 2, text: '1/2' },
  { value: 5 / 8, text: '5/8' },
  { value: 2 / 3, text: '2/3' },
  { value: 3 / 4, text: '3/4' },
  { value: 7 / 8, text: '7/8' },
  { value: 1, text: '1' },
];

function formatDecimal(quantity: number): string {
  return new Intl.NumberFormat('en-GB', { maximumFractionDigits: 2 }).format(quantity);
}

function findNearestFraction(value: number): { value: number; text: string } {
  return FRACTION_STEPS.reduce((closest, step) => {
    if (Math.abs(step.value - value) < Math.abs(closest.value - value)) {
      return step;
    }

    return closest;
  });
}

function formatFraction(quantity: number): string {
  const sign = quantity < 0 ? '-' : '';
  const absoluteQuantity = Math.abs(quantity);
  const whole = Math.floor(absoluteQuantity);
  const remainder = absoluteQuantity - whole;
  const nearestFraction = findNearestFraction(remainder);

  if (nearestFraction.value === 1) {
    return `${sign}${whole + 1}`;
  }

  if (nearestFraction.value === 0) {
    return `${sign}${whole}`;
  }

  if (whole === 0) {
    return `${sign}${nearestFraction.text}`;
  }

  return `${sign}${whole} ${nearestFraction.text}`;
}

@Pipe({
  name: 'ingredientQty',
  standalone: true,
})
export class IngredientQuantityPipe implements PipeTransform {
  transform(quantity: number | null | undefined, unitAbbreviation: string | null | undefined): string {
    if (quantity === null || quantity === undefined) {
      return '';
    }

    const normalizedUnit = String(unitAbbreviation ?? '').trim().toLowerCase();
    if (IMPERIAL_UNITS.has(normalizedUnit)) {
      return formatFraction(quantity);
    }

    return formatDecimal(quantity);
  }
}
