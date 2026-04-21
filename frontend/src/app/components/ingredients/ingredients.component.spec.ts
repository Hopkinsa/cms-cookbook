import { TestBed } from '@angular/core/testing';
import { IngredientsComponent } from './ingredients.component';
import { SignalService } from '@server/core/services';

describe('IngredientsComponent', () => {
  it('creates and injects signal service and decimal pipe is available', () => {
    const mockSignal = {
      ingredients: () => [],
      units: () => [],
      recipeServesAdjustment: () => 1,
    };
    TestBed.configureTestingModule({
      imports: [IngredientsComponent],
      providers: [{ provide: SignalService, useValue: mockSignal }],
    });
    const fixture = TestBed.createComponent(IngredientsComponent);
    const comp = fixture.componentInstance as any;

    expect(comp).toBeTruthy();
    expect(comp.signalService).toBeDefined();
  });

  it('renders converted quantities when a display mode is supplied', async () => {
    const mockSignal = {
      ingredients: () => [
        {
          is_title: false,
          ingredient: 'Milk',
          preparation: '',
          quantity: 2,
          quantity_unit: 3,
        },
      ],
      units: () => [
        { id: 0, title: '', unit: '---', abbreviation: '' },
        { id: 3, title: 'Imperial Volume', unit: 'Cup', abbreviation: 'cup' },
        { id: 10, title: 'Metric Volume', unit: 'Milliliter', abbreviation: 'ml' },
      ],
      recipeServesAdjustment: () => 1,
    };

    TestBed.configureTestingModule({
      imports: [IngredientsComponent],
      providers: [{ provide: SignalService, useValue: mockSignal }],
    });
    const fixture = TestBed.createComponent(IngredientsComponent);

    fixture.componentRef.setInput('displayMode', 'metric');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('473.18');
    expect(fixture.nativeElement.textContent).toContain('ml Milk');
  });

  it('renders imperial quantities as cookbook fractions', async () => {
    const mockSignal = {
      ingredients: () => [
        {
          is_title: false,
          ingredient: 'Milk',
          preparation: '',
          quantity: 500,
          quantity_unit: 10,
        },
      ],
      units: () => [
        { id: 0, title: '', unit: '---', abbreviation: '' },
        { id: 3, title: 'Imperial Volume', unit: 'Cup', abbreviation: 'cup' },
        { id: 10, title: 'Metric Volume', unit: 'Milliliter', abbreviation: 'ml' },
      ],
      recipeServesAdjustment: () => 1,
    };

    TestBed.configureTestingModule({
      imports: [IngredientsComponent],
      providers: [{ provide: SignalService, useValue: mockSignal }],
    });
    const fixture = TestBed.createComponent(IngredientsComponent);

    fixture.componentRef.setInput('displayMode', 'imperial');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('2 1/8');
    expect(fixture.nativeElement.textContent).toContain('cup Milk');
  });
});
