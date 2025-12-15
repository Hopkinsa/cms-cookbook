import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { FileService, SignalService } from '@server/core/services';
import { SortArrayPipe } from '@server/shared/pipes';
import { ImageUploadComponent } from '@server/components/image-upload/image-upload.component';

@Component({
  selector: 'app-display-images',
  templateUrl: './display-images.component.html',
  styleUrls: ['./display-images.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    SortArrayPipe,
    ImageUploadComponent,
  ],
  animations: [],
})
export class DisplayImagesComponent {
  private router: Router = inject(Router);
  protected fileService: FileService = inject(FileService);
  protected signalService: SignalService = inject(SignalService);

  delete(imageName: string): void {
    if (imageName !== '') {
      this.fileService.deleteImage(imageName).subscribe(() => { this.fileService.getImages.set(Date.now()) });
    }
  }

  back(): void {
    this.router.navigate(['/']);
  }
}