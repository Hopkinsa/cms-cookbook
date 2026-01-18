import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { BackupService, SignalService } from '@server/core/services';
import { crudResponse } from '@server/core/interface';
import { FeedbackComponent } from '@server/components/feedback/feedback.component';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-backup',
  templateUrl: './backup.component.html',
  styleUrls: ['./backup.component.scss'],
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatProgressBarModule, FeedbackComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackupComponent {
  private router: Router = inject(Router);
  protected signalService: SignalService = inject(SignalService);
  private backupService: BackupService = inject(BackupService);
  protected readonly enableBtn = signal(true);
  uploadProgress = 0;
  value = 0;
  isUploading = false; // To track upload status

  private initPage = effect(() => {
    this.signalService.canEdit();
  });

  pad(num: number): string {
    return num.toString().padStart(2, '0');
  }

  downloadName(): string {
    const oDate = new Date();
    const ymd = `${this.pad(oDate.getFullYear())}${this.pad(oDate.getMonth() + 1)}${this.pad(oDate.getDate())}`;
    const hms = `${this.pad(oDate.getHours())}${this.pad(oDate.getMinutes())}${this.pad(oDate.getSeconds())}`;
    const dlName = `backup-${ymd}${hms}.zip`;
    return dlName;
  }

  backup(): void {
    this.enableBtn.set(false);
    this.backupService.backupDB().subscribe((res) => {
      if (res !== null && res !== undefined) {
        this.signalService.feedbackMessage.set({ type: 'success', message: 'Database backed up' });
        const a = document.createElement('a');
        const objUrl = URL.createObjectURL(res);
        a.href = objUrl;
        a.download = this.downloadName();
        a.click();
        URL.revokeObjectURL(objUrl);
      }
      this.enableBtn.set(true);
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.enableBtn.set(false);
      const formData = new FormData();
      formData.append('file', file);

      this.isUploading = true; // Start uploading
      this.backupService.uploadFile(formData).subscribe(
        (res: any) => {
          if (res.type === HttpEventType.UploadProgress) {
            if (event.total) {
              this.uploadProgress = Math.round((100 * res.loaded) / res.total);
            }
          } else if (res.type === HttpEventType.Response) {
            this.uploadProgress = 100; // Ensure progress reaches 100%
            this.signalService.feedbackMessage.set({ type: 'success', message: 'File uploaded' });
            this.isUploading = false;
          }
        },
        (error: any) => {
          console.error('Upload error:', error);
          this.signalService.feedbackMessage.set({ type: 'error', message: 'File upload failed' });
          this.isUploading = false;
        },
      );
      this.enableBtn.set(true);
    }
  }

  restore(): void {
    this.backupService.restoreDB().subscribe((res) => {
      if (res !== null && res !== undefined) {
        if ((res as unknown as crudResponse).completed) {
          this.signalService.feedbackMessage.set({ type: 'success', message: 'Database restored' });
        }
      }
    });
  }

  back(): void {
    this.router.navigate(['/']);
  }
}
