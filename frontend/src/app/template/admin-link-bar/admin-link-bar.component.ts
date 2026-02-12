import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

import { SignalService } from '@server/core/services/signal.service';
@Component({
  selector: 'app-admin-link-bar',
  templateUrl: './admin-link-bar.component.html',
  styleUrl: './admin-link-bar.component.scss',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatMenuModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLinkBarComponent {
  private router: Router = inject(Router);
  protected signalService: SignalService = inject(SignalService);
  readonly links = [
    ['/tags', 'Tags', ''],
    ['/images', 'Images', ''],
    ['/units', 'Units', ''],
    ['/backup', 'Backup', 'admin'],
  ];

  nav(idx: number): void {
    this.router.navigate([this.links[idx][0]]);
  }

  toggleEdit(): void {
    const editToggle = this.signalService.editEnabled();
    this.signalService.editEnabled.set(!editToggle);
  }
}
