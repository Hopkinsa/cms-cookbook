import { TestBed } from '@angular/core/testing';
import { DisplayTagsComponent } from './display-tags.component';
import { SignalService } from '@server/core/services';
import { Router } from '@angular/router';

describe('DisplayTagsComponent', () => {
  it('back navigates', () => {
    const mockSignal: any = {};
    const mockRouter: any = { navigate: jest.fn() };
    TestBed.configureTestingModule({
      imports: [DisplayTagsComponent],
      providers: [
        { provide: SignalService, useValue: mockSignal },
        { provide: Router, useValue: mockRouter },
      ],
    });

    const fixture = TestBed.createComponent(DisplayTagsComponent);
    const comp = fixture.componentInstance as any;
    comp.back();
    expect(mockRouter.navigate).toHaveBeenCalled();
  });
});
