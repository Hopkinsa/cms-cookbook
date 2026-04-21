import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageViewerComponent } from './image-viewer.component';

describe('ImageViewerComponent', () => {
  let component: ImageViewerComponent;
  let fixture: ComponentFixture<ImageViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageViewerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageViewerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start closed with empty image state', () => {
    expect(component.imgView()).toBe(false);
    expect(component.imgSrc()).toBe('');
    expect(component.caption()).toBe('');
  });

  it('should close and clear the active image when the close button is clicked', async () => {
    component.imgView.set(true);
    component.imgSrc.set('/images/uploaded/test.jpg');
    component.caption.set('Preview image');
    fixture.detectChanges();
    await fixture.whenStable();

    const button = fixture.nativeElement.querySelector('.close') as HTMLButtonElement;
    button.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.imgView()).toBe(false);
    expect(component.imgSrc()).toBe('');
    expect(component.caption()).toBe('');
    expect(fixture.nativeElement.querySelector('.modal').className).toContain('modalClose');
  });
});
