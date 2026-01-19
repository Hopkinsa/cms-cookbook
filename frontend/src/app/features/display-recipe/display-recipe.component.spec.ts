import { TestBed } from '@angular/core/testing';
import { DisplayRecipeComponent } from './display-recipe.component';
import { SignalService } from '@server/core/services';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

describe('DisplayRecipeComponent', () => {
  it('computed title, totalTime, banner and serving up/down, amend/back', () => {
    const recipe: any = { title: 'T', prep_time: 10, cook_time: 5, img_url: 'file.png', serves: 2 };
    const recipeServesSignal: any = jest.fn(() => 2);
    recipeServesSignal.set = jest.fn();
    recipeServesSignal.update = jest.fn();
    const mockSignal: any = { recipe: () => recipe, recipeServes: recipeServesSignal, returnTo: { set: jest.fn() } };
    const mockTitle: any = { setTitle: jest.fn() };
    const mockRouter: any = { navigate: jest.fn(), url: '/recipe/1' };

    TestBed.configureTestingModule({ imports: [DisplayRecipeComponent], providers: [{ provide: SignalService, useValue: mockSignal }, { provide: Title, useValue: mockTitle }, { provide: Router, useValue: mockRouter }] });

    const fixture = TestBed.createComponent(DisplayRecipeComponent);
    const comp = fixture.componentInstance as any;

    // access computed to trigger title set
    expect(comp.recipeTitle()).toBe('T');
    expect(mockTitle.setTitle).toHaveBeenCalled();

    expect(comp.totalTime()).toBe(15);
    expect(comp.banner()).toContain('image/');

    // serving up/down
    (mockSignal.recipeServes as any).update = jest.fn((fn: any) => fn(2));
    comp.servingUp();
    expect((mockSignal.recipeServes as any).update).toHaveBeenCalled();

    (mockSignal.recipeServes as any).value = () => 2;
    comp.servingDown();
    expect((mockSignal.recipeServes as any).update).toHaveBeenCalled();

    // amend should set returnTo and navigate
    comp.amend();
    expect(mockSignal.returnTo.set).toHaveBeenCalled();
    // back
    comp.back();
    expect(mockRouter.navigate).toHaveBeenCalled();
  });
});