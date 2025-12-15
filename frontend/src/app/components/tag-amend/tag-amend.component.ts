import { Component, effect, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Field, form } from '@angular/forms/signals';

import { ITags, tagsInitialState } from '@server/core/interface';
import { TagService } from '@server/core/services';

@Component({
  selector: 'app-tag-amend',
  templateUrl: './tag-amend.component.html',
  styleUrls: ['./tag-amend.component.scss'],
  standalone: true,
  imports: [
    Field,
    MatButtonModule,
    MatIconModule,
  ],
  animations: [],
})
export class TagAmendComponent {
  signalTag = input<any>(tagsInitialState, {
    alias: "tag",
  });

  protected tagService: TagService = inject(TagService);
  protected tagModel = signal<ITags>(tagsInitialState);
  protected tagForm = form(this.tagModel);
  protected enableSave = true;

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
        }
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
    }
    if (tagId === -1) {
      this.enableSave = false;
      this.tagService.createTag(tagObj).subscribe(() => { this.tagService.getTags.set(Date.now()); this.enableSave = true; });
    }
    if (tagId >= 0) {
      this.enableSave = false;
      this.tagService.updateTag(tagId, tagObj).subscribe(() => { this.tagService.getTags.set(Date.now()); this.enableSave = true; });
    }
  }
}
