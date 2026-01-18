import { TestBed } from '@angular/core/testing';
import { FileService } from '@server/core/services/file.service';
import { imagesResolver } from './images.resolver';

describe('imagesResolver', () => {
  it('sets getImages when null', () => {
    const getImages: any = (() => null);
    getImages.set = jest.fn();
    const svc = { getImages } as any;
    TestBed.configureTestingModule({ providers: [{ provide: FileService, useValue: svc }] });

    const res = TestBed.runInInjectionContext(() => imagesResolver({} as any, {} as any));
    expect(getImages.set).toHaveBeenCalled();
    expect(res).toBe(true);
  });
});