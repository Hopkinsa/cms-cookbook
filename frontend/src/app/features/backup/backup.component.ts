import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { BackupService, SignalService } from '@server/core/services';
import { crudResponse } from '@server/core/interface';
import { FeedbackComponent } from '@server/components/feedback/feedback.component';

@Component({
  selector: 'app-backup',
  templateUrl: './backup.component.html',
  styleUrls: ['./backup.component.scss'],
  standalone: true,
  imports: [MatButtonModule, MatIconModule, FeedbackComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackupComponent {
  private router: Router = inject(Router);
  protected signalService: SignalService = inject(SignalService);
  private backupService: BackupService = inject(BackupService);
  protected enableBtn = true;

  private initPage = effect(() => {
    this.signalService.canEdit();
  });

  backup(): void {
    this.enableBtn = false;
    this.backupService.backupDB().subscribe((res) => {
      if (res !== null && res !== undefined) {
        if ((res as unknown as crudResponse).completed) {
          this.signalService.feedbackMessage.set({ type: 'success', message: 'Database backed up' });
        }
      }
      this.enableBtn = true;
    });
  }

  restore(): void {
    this.enableBtn = false;
    this.backupService.restoreDB().subscribe((res) => {
      if (res !== null && res !== undefined) {
        if ((res as unknown as crudResponse).completed) {
          this.signalService.feedbackMessage.set({ type: 'success', message: 'Database restored' });
        }
      }
      this.enableBtn = true;
    });
  }

  back(): void {
    this.router.navigate(['/']);
  }
}
