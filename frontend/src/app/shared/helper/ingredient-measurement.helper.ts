import { IIngredients, IUnits } from '@server/core/interface';

export type IngredientMeasurementMode = 'original' | 'metric' | 'imperial';

export type IngredientMeasurementDisplay = {
  quantity: number;
  unitAbbreviation: string;
};

type MeasurementSystem = Exclude<IngredientMeasurementMode, 'original'>;
type MeasurementKind = 'volume' | 'weight';

type ConvertibleUnit = {
  abbreviation: string;
  system: MeasurementSystem;
  kind: MeasurementKind;
  toBase: number;
};

const CONVERTIBLE_UNITS: Record<string, ConvertibleUnit> = {
  tsp: { abbreviation: 'tsp', system: 'imperial', kind: 'volume', toBase: 4.92892 },
  tbsp: { abbreviation: 'tbsp', system: 'imperial', kind: 'volume', toBase: 14.7868 },
  cup: { abbreviation: 'cup', system: 'imperial', kind: 'volume', toBase: 236.588 },
  'fl oz': { abbreviation: 'fl oz', system: 'imperial', kind: 'volume', toBase: 29.5735 },
  pt: { abbreviation: 'pt', system: 'imperial', kind: 'volume', toBase: 473.176 },
  qt: { abbreviation: 'qt', system: 'imperial', kind: 'volume', toBase: 946.353 },
  gal: { abbreviation: 'gal', system: 'imperial', kind: 'volume', toBase: 3785.41 },
  oz: { abbreviation: 'oz', system: 'imperial', kind: 'weight', toBase: 28.3495 },
  lb: { abbreviation: 'lb', system: 'imperial', kind: 'weight', toBase: 453.592 },
  ml: { abbreviation: 'ml', system: 'metric', kind: 'volume', toBase: 1 },
  l: { abbreviation: 'l', system: 'metric', kind: 'volume', toBase: 1000 },
  mg: { abbreviation: 'mg', system: 'metric', kind: 'weight', toBase: 0.001 },
  g: { abbreviation: 'g', system: 'metric', kind: 'weight', toBase: 1 },
  kg: { abbreviation: 'kg', system: 'metric', kind: 'weight', toBase: 1000 },
};

const TARGET_UNITS: Record<MeasurementSystem, Record<MeasurementKind, ConvertibleUnit[]>> = {
  metric: {
    volume: [CONVERTIBLE_UNITS['l'], CONVERTIBLE_UNITS['ml']],
    weight: [CONVERTIBLE_UNITS['kg'], CONVERTIBLE_UNITS['g'], CONVERTIBLE_UNITS['mg']],
  },
  imperial: {
    volume: [CONVERTIBLE_UNITS['gal'], CONVERTIBLE_UNITS['qt'], CONVERTIBLE_UNITS['cup'], CONVERTIBLE_UNITS['tbsp'], CONVERTIBLE_UNITS['tsp']],
    weight: [CONVERTIBLE_UNITS['lb'], CONVERTIBLE_UNITS['oz']],
  },
};

function normalizeAbbreviation(abbreviation: string): string {
  return abbreviation.trim().toLowerCase();
}

function findUnit(units: IUnits[] | null | undefined, unitId: number): IUnits | undefined {
  if (!units) {
    return undefined;
  }

  return units.find((unit) => unit.id === unitId) ?? units[unitId];
}

function selectMetricUnit(baseQuantity: number, kind: MeasurementKind): ConvertibleUnit {
  const absoluteBaseQuantity = Math.abs(baseQuantity);

  if (kind === 'volume') {
    return absoluteBaseQuantity >= CONVERTIBLE_UNITS['l'].toBase ? CONVERTIBLE_UNITS['l'] : CONVERTIBLE_UNITS['ml'];
  }

  if (absoluteBaseQuantity >= CONVERTIBLE_UNITS['kg'].toBase) {
    return CONVERTIBLE_UNITS['kg'];
  }

  if (absoluteBaseQuantity > 0 && absoluteBaseQuantity < CONVERTIBLE_UNITS['g'].toBase) {
    return CONVERTIBLE_UNITS['mg'];
  }

  return CONVERTIBLE_UNITS['g'];
}

function selectImperialUnit(baseQuantity: number, kind: MeasurementKind): ConvertibleUnit {
  const absoluteBaseQuantity = Math.abs(baseQuantity);

  if (kind === 'volume') {
    if (absoluteBaseQuantity >= CONVERTIBLE_UNITS['gal'].toBase) {
      return CONVERTIBLE_UNITS['gal'];
    }

    if (absoluteBaseQuantity >= CONVERTIBLE_UNITS['qt'].toBase) {
      return CONVERTIBLE_UNITS['qt'];
    }

    if (absoluteBaseQuantity >= CONVERTIBLE_UNITS['cup'].toBase / 4) {
      return CONVERTIBLE_UNITS['cup'];
    }

    if (absoluteBaseQuantity >= CONVERTIBLE_UNITS['tbsp'].toBase) {
      return CONVERTIBLE_UNITS['tbsp'];
    }

    return CONVERTIBLE_UNITS['tsp'];
  }

  return absoluteBaseQuantity >= CONVERTIBLE_UNITS['lb'].toBase ? CONVERTIBLE_UNITS['lb'] : CONVERTIBLE_UNITS['oz'];
}

function selectTargetUnit(baseQuantity: number, targetSystem: MeasurementSystem, kind: MeasurementKind): ConvertibleUnit {
  if (targetSystem === 'metric') {
    return selectMetricUnit(baseQuantity, kind);
  }

  return selectImperialUnit(baseQuantity, kind);
}

export function getIngredientMeasurementDisplay(
  ingredient: IIngredients,
  units: IUnits[] | null | undefined,
  displayMode: IngredientMeasurementMode,
  quantityMultiplier = 1,
): IngredientMeasurementDisplay {
  const sourceUnit = findUnit(units, ingredient.quantity_unit);
  const scaledQuantity = ingredient.quantity * quantityMultiplier;
  const unitAbbreviation = sourceUnit?.abbreviation ?? '';

  if (displayMode === 'original' || scaledQuantity <= 0 || unitAbbreviation === '') {
    return { quantity: scaledQuantity, unitAbbreviation };
  }

  const sourceDefinition = CONVERTIBLE_UNITS[normalizeAbbreviation(unitAbbreviation)];
  if (!sourceDefinition) {
    return { quantity: scaledQuantity, unitAbbreviation };
  }

  const baseQuantity = scaledQuantity * sourceDefinition.toBase;
  const targetUnit = selectTargetUnit(baseQuantity, displayMode, sourceDefinition.kind);

  return {
    quantity: baseQuantity / targetUnit.toBase,
    unitAbbreviation: targetUnit.abbreviation,
  };
}
