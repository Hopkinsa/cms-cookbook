import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { environment } from 'src/environment/environment';

import { FileService, SignalService } from '@server/core/services';
import { SortArrayPipe, TruncatePipe } from '@server/shared/pipes';
import { generateFilename } from '@server/shared/helper/filename.helper';
import { FeedbackComponent } from '@server/components/feedback/feedback.component';
import { ImageUploadComponent } from '@server/components/image-upload/image-upload.component';
import { ImageViewerComponent } from '@server/components/image-viewer/image-viewer.component';

import { crudResponse } from '@server/core/interface';

@Component({
  selector: 'app-display-images',
  templateUrl: './display-images.component.html',
  styleUrls: ['./display-images.component.scss'],
  standalone: true,
  imports: [MatButtonModule, MatIconModule, SortArrayPipe, TruncatePipe, FeedbackComponent, ImageUploadComponent, ImageViewerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisplayImagesComponent {
  private router: Router = inject(Router);
  protected imgURL = `${environment.baseImgURL}`;
  protected fileService: FileService = inject(FileService);
  protected signalService: SignalService = inject(SignalService);

  protected imageModal = {
    open: false,
    src: '',
    caption: '',
  };

  openModal(imageName: string, type: string): void {
    const imgNames = generateFilename(imageName);
    let imgSrc = '';
    if (type === 'original') {
       imgSrc = imageName
    } else if (type === 'icon'){
       imgSrc = imgNames.icon
    } else if (type === 'banner'){
       imgSrc = imgNames.banner
    } else {
      return;
    }
    this.imageModal = {
      open: true,
      src: this.imgURL + imgSrc,
      caption: `${imageName} ${type}`,
    };
  }

  amend(imageName: string): void {
    this.router.navigate(['/images', imageName]);
  }

  altImage(imageName: string, what: string): string {
    const imgNames = generateFilename(imageName);
    return what === 'banner' ? imgNames.banner : imgNames.icon;
  }

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
