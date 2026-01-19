import { TestBed } from '@angular/core/testing';
import { SignalService, TagService } from '@server/core/services';
import { TagAmendComponent } from './tag-amend.component';

describe('TagAmendComponent', () => {
  it('creates tag when id === -1', (done) => {
    const mockSignalService: any = { feedbackMessage: { set: jest.fn() } };
    const mockTagService: any = {
      createTag: jest.fn(() => ({ subscribe: (fn: any) => fn({ completed: true }) })),
      getTags: { set: jest.fn() },
    };

    TestBed.configureTestingModule({ imports: [TagAmendComponent], providers: [{ provide: SignalService, useValue: mockSignalService }, { provide: TagService, useValue: mockTagService }] });

    const fixture = TestBed.createComponent(TagAmendComponent);
    const comp = fixture.componentInstance;

    comp['tagModel'].set({ id: -1, type: 'x', tag: 'abc' } as any);

    comp.save(new Event('submit'));

    // createTag should have been called and feedback set
    expect(mockTagService.createTag).toHaveBeenCalled();
    expect(mockSignalService.feedbackMessage.set).toHaveBeenCalledWith({ type: 'success', message: 'Tag added' });
    expect(mockTagService.getTags.set).toHaveBeenCalled();
    done();
  });

  it('updates tag when id >= 0', (done) => {
    const mockSignalService: any = { feedbackMessage: { set: jest.fn() } };
    const mockTagService: any = {
      updateTag: jest.fn(() => ({ subscribe: (fn: any) => fn({ completed: true }) })),
      getTags: { set: jest.fn() },
    };

    TestBed.configureTestingModule({ imports: [TagAmendComponent], providers: [{ provide: SignalService, useValue: mockSignalService }, { provide: TagService, useValue: mockTagService }] });

    const fixture = TestBed.createComponent(TagAmendComponent);
    const comp = fixture.componentInstance;

    comp['tagModel'].set({ id: 4, type: 'x', tag: 'abc' } as any);

    comp.save(new Event('submit'));

    expect(mockTagService.updateTag).toHaveBeenCalledWith(4, { id: 4, type: 'x', tag: 'abc' });
    expect(mockSignalService.feedbackMessage.set).toHaveBeenCalledWith({ type: 'success', message: 'Tag saved' });
    expect(mockTagService.getTags.set).toHaveBeenCalled();
    done();
  });
});
