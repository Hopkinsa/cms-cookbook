import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';

import { ScaffoldLayoutComponent } from './scaffold.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { environment } from './../../../environment/environment';

const environmentMock = {
  production: false,
  baseApiURL: '',
  baseImgURL: '',
};

describe('ScaffoldLayoutComponent', () => {
  let component: ScaffoldLayoutComponent;
  let fixture: ComponentFixture<ScaffoldLayoutComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScaffoldLayoutComponent, RouterOutlet, HeaderComponent, FooterComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), { provide: environment, useValue: environmentMock }],
    }).compileComponents();
    fixture = TestBed.createComponent(ScaffoldLayoutComponent);
    httpMock = TestBed.inject(HttpTestingController);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the ScaffoldLayoutComponent', () => {
    expect(component).toBeTruthy();
  });
});
