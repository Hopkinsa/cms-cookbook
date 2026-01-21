import { TestBed } from '@angular/core/testing';
import { AmendTagsComponent } from './amend-tags.component';
import { SignalService, TagService } from '@server/core/services';
import { of } from 'rxjs';

describe('AmendTagsComponent', () => {
  it('addTag and delete with id -1 and id >=0', () => {
    const tags = [{ id: -1, type: 't' } as any];
    const tagsSignal: any = jest.fn(() => tags);
    tagsSignal.set = jest.fn();
    const mockSignal: any = { tags: tagsSignal, feedbackMessage: { set: jest.fn() }, canEdit: jest.fn() };
    const mockTagService: any = { deleteTag: jest.fn(() => of({ completed: true })), getTags: { set: jest.fn() } };
    const mockRouter: any = { navigate: jest.fn() };

    TestBed.configureTestingModule({
      imports: [AmendTagsComponent],
      providers: [
        { provide: SignalService, useValue: mockSignal },
        { provide: TagService, useValue: mockTagService },
        { provide: 'Router', useValue: mockRouter },
      ],
    });

    const fixture = TestBed.createComponent(AmendTagsComponent);
    const comp = fixture.componentInstance as any;

    comp.addTag();
    expect(mockSignal.tags.set).toHaveBeenCalled();

    // delete with id -1 should remove placeholder
    comp.delete(-1);
    expect(mockSignal.tags.set).toHaveBeenCalled();

    // delete real id
    comp.delete(5);
    expect(mockTagService.deleteTag).toHaveBeenCalled();
    expect(mockTagService.getTags.set).toHaveBeenCalled();
  });
});
