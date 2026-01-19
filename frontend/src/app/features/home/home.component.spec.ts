import { TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { SignalService } from '@server/core/services';
import { Router, ActivatedRoute } from '@angular/router';

describe('HomeComponent', () => {
  it('creates with service injected', () => {
    const mockSignal: any = {};
    const mockRouter: any = { navigate: jest.fn(), url: '/' };
    const mockRoute: any = { snapshot: { data: {} } };
    TestBed.configureTestingModule({ imports: [HomeComponent], providers: [{ provide: SignalService, useValue: mockSignal }, { provide: Router, useValue: mockRouter }, { provide: ActivatedRoute, useValue: mockRoute }] });
    const fixture = TestBed.createComponent(HomeComponent);
    const comp = fixture.componentInstance as any;
    expect(comp.imgURL).toContain('template/');
  });