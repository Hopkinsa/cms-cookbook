import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { Template } from './template';
import { ScaffoldLayoutComponent } from './scaffold/scaffold.component';
import { environment } from 'src/environment/environment.development';

const environmentMock = {
  production: false,
  baseApiURL: '',
  baseImgURL: '',
};

describe('Template', () => {
  let component: Template;
  let fixture: ComponentFixture<Template>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Template, ScaffoldLayoutComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), { provide: environment, useValue: environmentMock }],
    }).compileComponents();
    fixture = TestBed.createComponent(Template);
    httpMock = TestBed.inject(HttpTestingController);

    component = fixture.componentInstance;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the Template component', () => {
    expect(component).toBeTruthy();
  });
});
