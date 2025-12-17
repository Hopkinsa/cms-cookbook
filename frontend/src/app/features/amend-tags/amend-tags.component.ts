import { KeyValuePipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { form } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { SignalService, TagService } from '@server/core/services';
import { GroupByPipe, RemoveCharactersPipe } from '@server/shared/pipes';
import { ITags, tagsInitialState, crudResponse } from '@server/core/interface';
import { FeedbackComponent } from '@server/components/feedback/feedback.component';
import { TagAmendComponent } from '@server/components/tag-amend/tag-amend.component';

@Component({
  selector: 'app-amend-tags',
  templateUrl: './amend-tags.component.html',
  styleUrls: ['./amend-tags.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    GroupByPipe,
    KeyValuePipe,
    FeedbackComponent,
    RemoveCharactersPipe,
    TagAmendComponent,
  ],
  animations: [],
})
export class AmendTagsComponent {
  private router: Router = inject(Router);
  protected signalService: SignalService = inject(SignalService);
  protected tagService: TagService = inject(TagService);

  protected tagModel = signal<ITags[]>([tagsInitialState]);
  protected tagForm = form(this.tagModel);

  private initPage = effect(() => {
    this.signalService.canEdit();

    // populate on change
    const tags = this.signalService.tags();
    // Prevent initial null value from signal creation
    if (tags !== null) {
      this.tagModel.set(tags);
    }
  })

  addTag(): void {
    const x = this.signalService.tags() as ITags[];
    const newTag = tagsInitialState;
    newTag.type = '||New||'; // Use "||" to manipulate alphanumeric grouping of Type
    if (x !== null) {
      x.push(newTag);
      this.signalService.tags.set(x.slice());
      // Force new object/array
      // use someArray.slice() (for Arrays - returns a copy of array) and Object Destructuring ({...someSignal() }) (for objects)
      // to create a new memory reference so that the signal pickups the change.
    }
  }

  delete(id: number): void {
    if (id >= 0) {
      this.tagService.deleteTag(id).subscribe((res) => {
        if (res !== null && res !== undefined) {
          if ((res as unknown as crudResponse).completed) {
            this.signalService.feedbackMessage.set({ type: 'success', message: 'Tag deleted' });
          }
        }
        this.tagService.getTags.set(Date.now())
      });
    }
    if (id === -1) {
      const x = this.signalService.tags() as ITags[];
      if (x !== undefined) {
        const index = x.map(item => item.id).indexOf(-1);
        x.splice(index, 1);
        this.signalService.tags.set(x.slice());
        this.signalService.feedbackMessage.set({ type: 'success', message: 'Tag deleted' });
        // Force new object/array
        // use someArray.slice() (for Arrays - returns a copy of array) and Object Destructuring ({...someSignal() }) (for objects)
        // to create a new memory reference so that the signal pickups the change.
      }
    }
  }

  back(): void {
    this.router.navigate(['/']);
  }
}