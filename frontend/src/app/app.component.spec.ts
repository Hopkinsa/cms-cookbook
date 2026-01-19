import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  it('has title cookbook', () => {
    TestBed.configureTestingModule({ imports: [AppComponent] });
    const fixture = TestBed.createComponent(AppComponent);
    const comp = fixture.componentInstance as any;

    expect(comp.title).toBe('cookbook');
  });
});