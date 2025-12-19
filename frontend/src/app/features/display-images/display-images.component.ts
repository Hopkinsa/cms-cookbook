import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { environment } from 'src/environment/environment';

import { FileService, SignalService } from '@server/core/services';
import { SortArrayPipe } from '@server/shared/pipes';
import { FeedbackComponent } from '@server/components/feedback/feedback.component';
import { ImageUploadComponent } from '@server/components/image-upload/image-upload.component';
import { crudResponse } from '@server/core/interface';

@Component({
  selector: 'app-display-images',
  templateUrl: './display-images.component.html',
  styleUrls: ['./display-images.component.scss'],
  standalone: true,
  imports: [MatButtonModule, MatIconModule, SortArrayPipe, FeedbackComponent, ImageUploadComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisplayImagesComponent {
  private router: Router = inject(Router);
  protected imgURL = `${environment.baseImgURL}image/`;
  protected fileService: FileService = inject(FileService);
  protected signalService: SignalService = inject(SignalService);

  delete(imageName: string): void {
    if (imageName !== '') {
      this.fileService.deleteImage(imageName).subscribe((res) => {
        if (res !== null && res !== undefined) {
          if ((res as unknown as crudResponse).completed) {
            this.signalService.feedbackMessage.set({ type: 'success', message: 'Image deleted' });
          }
        }
        this.fileService.getImages.set(Date.now());
      });
    }
  }

  back(): void {
    this.router.navigate(['/']);
  }
}
