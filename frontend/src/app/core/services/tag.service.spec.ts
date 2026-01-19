import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TagService } from './tag.service';
import { ErrorHandlerService } from './error-handler.service';

describe('TagService', () => {
  let http: any;
  let error: any;

  beforeEach(() => {
    http = { post: jest.fn(() => of('posted')), patch: jest.fn(() => of('patched')), delete: jest.fn(() => of('deleted')) };
    error = { handleError: jest.fn(() => (err: any) => of([])) };

    TestBed.configureTestingModule({ providers: [{ provide: HttpClient, useValue: http }, { provide: ErrorHandlerService, useValue: error }] });
  });

  it('createTag calls POST /tags', (done) => {
    const svc = TestBed.inject(TagService);
    const tag = { id: 1, title: 'X' } as any;
    svc.createTag(tag).subscribe(() => {
      expect(http.post).toHaveBeenCalledWith('tags', tag);
      done();
    });
  });

  it('updateTag calls PATCH /tags/:id', (done) => {
    const svc = TestBed.inject(TagService);
    const data = { title: 'Y' } as any;
    svc.updateTag(5, data).subscribe(() => {
      expect(http.patch).toHaveBeenCalledWith('tags/5', data);
      done();
    });
  });

  it('deleteTag calls DELETE /tags/:id', (done) => {
    const svc = TestBed.inject(TagService);
    svc.deleteTag(9).subscribe(() => {
      expect(http.delete).toHaveBeenCalledWith('tags/9');
      done();
    });
  });
});
