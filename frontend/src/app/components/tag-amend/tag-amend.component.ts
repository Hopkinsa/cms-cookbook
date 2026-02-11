import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Field, form } from '@angular/forms/signals';

import { crudResponse, ITags, tagsInitialState } from '@server/core/interface';
import { SignalService, TagService } from '@server/core/services';

@Component({
  selector: 'app-tag-amend',
  templateUrl: './tag-amend.component.html',
  styleUrls: ['./tag-amend.component.scss'],
  standalone: true,
  imports: [Field, MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagAmendComponent {
  signalTag = input<any>(tagsInitialState, {
    alias: 'tag',
  });

  protected signalService: SignalService = inject(SignalService);
  protected tagService: TagService = inject(TagService);
  protected tagModel = signal<ITags>({...tagsInitialState});
  protected tagForm = form(this.tagModel);
  protected readonly enableSave = signal(true);

  private tagInit = effect(() => {
    // populate on change
    const tagSignal = this.signalTag();

    // Prevent initial null value from signal creation
    if (tagSignal !== null) {
      let initForm;
      if (tagSignal !== undefined) {
        initForm = {
          id: tagSignal.id,
          type: tagSignal.type,
          tag: tagSignal.tag,
        };
      } else {
        initForm = tagsInitialState;
      }
      this.tagModel.set(initForm);
    }
  });

  save(e: Event): void {
    e.preventDefault();
    const tagId = this.tagForm.id().value();
    const tagType = this.tagForm.type().value();
    const tagText = this.tagForm.tag().value();
    const tagObj: ITags = {
      id: tagId,
      type: tagType,
      tag: tagText,
    };
    if (tagId === -1) {
      this.enableSave.set(false);
      this.tagService.createTag(tagObj).subscribe((res) => {
        if (res !== null && res !== undefined) {
          if ((res as unknown as crudResponse).completed) {
            this.signalService.feedbackMessage.set({ type: 'success', message: 'Tag added' });
          }
        }
        this.tagService.getTags.set(Date.now());
        this.enableSave.set(true);
      });
    }
    if (tagId >= 0) {
      this.enableSave.set(false);
      this.tagService.updateTag(tagId, tagObj).subscribe((res) => {
        if (res !== null && res !== undefined) {
          if ((res as unknown as crudResponse).completed) {
            this.signalService.feedbackMessage.set({ type: 'success', message: 'Tag saved' });
          }
        }
        this.tagService.getTags.set(Date.now());
        this.enableSave.set(true);
      });
    }
  }
}
