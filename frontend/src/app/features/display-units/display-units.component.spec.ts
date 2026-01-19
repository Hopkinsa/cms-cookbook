import { TestBed } from '@angular/core/testing';
import { DisplayUnitsComponent } from './display-units.component';
import { SignalService } from '@server/core/services';
import { Router } from '@angular/router';

describe('DisplayUnitsComponent', () => {
  it('back navigates', () => {
    const mockSignal: any = {};
    const mockRouter: any = { navigate: jest.fn() };
    TestBed.configureTestingModule({ imports: [DisplayUnitsComponent], providers: [{ provide: SignalService, useValue: mockSignal }, { provide: Router, useValue: mockRouter }] });

    const fixture = TestBed.createComponent(DisplayUnitsComponent);
    const comp = fixture.componentInstance as any;
    comp.back();
    expect(mockRouter.navigate).toHaveBeenCalled();
  });