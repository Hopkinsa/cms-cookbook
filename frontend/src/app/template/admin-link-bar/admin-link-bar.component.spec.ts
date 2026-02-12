import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLinkBarComponent } from './admin-link-bar.component';

describe('AdminLinkBarComponent', () => {
  let component: AdminLinkBarComponent;
  let fixture: ComponentFixture<AdminLinkBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLinkBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminLinkBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
