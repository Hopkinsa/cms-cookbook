import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RecipeService } from './recipe.service';
import { ErrorHandlerService } from './error-handler.service';
import { SignalService } from '@server/core/services/signal.service';

describe('RecipeService', () => {
  let http: any;
  let error: any;

  beforeEach(() => {
    http = {
      post: jest.fn(() => of('posted')),
      patch: jest.fn(() => of('patched')),
      delete: jest.fn(() => of('deleted')),
    };
    error = { handleError: jest.fn(() => (err: any) => of([])) };

    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: http },
        { provide: ErrorHandlerService, useValue: error },
      ],
    });
  });

  it('createRecipe posts to /recipe', (done) => {
    const svc = TestBed.inject(RecipeService);
    const recipe = { id: 1, title: 'T' } as any;
    svc.createRecipe(recipe).subscribe(() => {
      expect(http.post).toHaveBeenCalledWith('recipe', recipe);
      done();
    });
  });

  it('updateRecipe patches /recipe/:id with signal recipe as body', (done) => {
    const fakeSignal = { recipe: jest.fn(() => ({ id: 1, title: 'head' })) } as any;
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [{ provide: HttpClient, useValue: http }, { provide: ErrorHandlerService, useValue: error }, { provide: SignalService, useValue: fakeSignal }] });
    const svc = TestBed.inject(RecipeService);
    svc.updateRecipe(3).subscribe(() => {
      expect(http.patch).toHaveBeenCalledWith('recipe/3', { id: 1, title: 'head' });
      done();
    });
  });

  it('deleteRecipe calls DELETE /recipe/:id', (done) => {
    const svc = TestBed.inject(RecipeService);
    svc.deleteRecipe(7).subscribe(() => {
      expect(http.delete).toHaveBeenCalledWith('recipe/7');
      done();
    });
  });
});
