import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { HeaderComponent } from './header.component';
import { SignalService } from '@server/core/services/signal.service';

const environmentMock = {
  production: false,
  baseApiURL: '',
  baseImgURL: '',
};

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let httpMock : HttpTestingController;
  let signalService: SignalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    signalService = TestBed.inject(SignalService);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the HeaderComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct imgURL', () => {
    expect(component['imgURL']).toBe(`template/`);
  });

  it('should toggle editEnabled signal', () => {
    signalService.editEnabled.set(false);
    component.toggleEdit();
    expect(signalService.editEnabled()).toBe(true);
    signalService.editEnabled.set(true);
    component.toggleEdit();
    expect(signalService.editEnabled()).toBe(false);
  });
});
