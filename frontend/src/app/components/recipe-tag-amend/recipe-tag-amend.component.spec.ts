import { TestBed } from '@angular/core/testing';
import { RecipeTagAmendComponent } from './recipe-tag-amend.component';
import { SignalService } from '@server/core/services';

describe('RecipeTagAmendComponent', () => {
  it('initializes and remove emits', () => {
    const mockSignal: any = { tags: jest.fn() };
    TestBed.configureTestingModule({ imports: [RecipeTagAmendComponent], providers: [{ provide: SignalService, useValue: mockSignal }] });
    const fixture = TestBed.createComponent(RecipeTagAmendComponent);
    const comp = fixture.componentInstance;

    // set the underlying input signal function that returns a signal when invoked
    (comp as any).signalRecipeTag = () => (() => ({ value: () => 'tag1' }));
    fixture.detectChanges();

    expect(comp['tagModel']().tag).toBe('tag1');

    const spy = jest.spyOn(comp['recipeTagRemove'], 'emit');
    comp.remove();
    expect(spy).toHaveBeenCalledWith(true);
  });
});
