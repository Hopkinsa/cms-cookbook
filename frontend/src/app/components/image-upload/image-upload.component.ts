import { CommonModule } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, Input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { FileService, SignalService } from '@server/core/services';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.scss',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressBarModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageUploadComponent {
  @Input() variant = '';
  fileUploaded = output<string>();

  protected signalService: SignalService = inject(SignalService);
  protected fileService: FileService = inject(FileService);
  uploadProgress = 0;
  value = 0;
  isUploading = false; // To track upload status

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      this.isUploading = true; // Start uploading
      this.fileService.uploadImage(formData).subscribe(
        (res: any) => {
          if (res.type === HttpEventType.UploadProgress) {
            if (event.total) {
              this.uploadProgress = Math.round((100 * res.loaded) / res.total);
            }
          } else if (res.type === HttpEventType.Response) {
            this.uploadProgress = 100; // Ensure progress reaches 100%
            this.signalService.feedbackMessage.set({ type: 'success', message: 'Image added' });
            this.fileService.getImages.set(Date.now());
            this.fileUploaded.emit(file.name);
            setTimeout(() => {
              this.isUploading = false; // Stop the progress indicator after a delay
              this.uploadProgress = 0; // Reset for the next upload
            }, 1000);
          }
        },
        (error) => {
          console.error('Upload error:', error);
          this.signalService.feedbackMessage.set({ type: 'error', message: 'Image upload failed' });
          this.isUploading = false;
        },
      );
    }
  }
}
