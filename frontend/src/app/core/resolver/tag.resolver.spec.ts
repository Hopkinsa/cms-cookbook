import { TestBed } from '@angular/core/testing';
import { TagService } from '@server/core/services/tag.service';
import { tagResolver } from './tag.resolver';

describe('tagResolver', () => {
  it('sets getTags when null', () => {
    const getTags: any = () => null;
    getTags.set = jest.fn();
    const tagService = { getTags } as any;
    TestBed.configureTestingModule({ providers: [{ provide: TagService, useValue: tagService }] });

    const res = TestBed.runInInjectionContext(() => tagResolver({} as any, {} as any));
    expect(getTags.set).toHaveBeenCalled();
    expect(res).toBe(true);
  });

  it('does not set getTags when already set', () => {
    const getTags: any = () => 123;
    getTags.set = jest.fn();
    const tagService = { getTags } as any;
    TestBed.configureTestingModule({ providers: [{ provide: TagService, useValue: tagService }] });

    const res = TestBed.runInInjectionContext(() => tagResolver({} as any, {} as any));
    expect(getTags.set).not.toHaveBeenCalled();
    expect(res).toBe(true);
  });
});
