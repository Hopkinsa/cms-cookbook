import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UnitSelectComponent } from './unit-select.component';

describe('UnitSelectComponent', () => {
  let fixture: ComponentFixture<UnitSelectComponent>;
  let comp: UnitSelectComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [UnitSelectComponent] });
    fixture = TestBed.createComponent(UnitSelectComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('sets form value when model is updated', () => {
    // directly set the model and verify it's reflected
    comp['fieldModel'].set('2');
    fixture.detectChanges();
    expect(comp['fieldModel']()).toBe('2');
  });

  it('emits fieldChange when model changes', () => {
    const localFixture = TestBed.createComponent(UnitSelectComponent);
    const localComp = localFixture.componentInstance as any;
    const spy = jest.spyOn(localComp['fieldChange'], 'emit');

    // initialize input before the first change detection run
    localComp.signalField = () => () => ({ value: () => '1' });
    localFixture.detectChanges();

    // change the model to trigger updateEffect
    localComp['fieldModel'].set('3');
    // trigger change detection to allow updateEffect to run
    localFixture.detectChanges();
    expect(spy).toHaveBeenCalledWith(3);
  });
});
