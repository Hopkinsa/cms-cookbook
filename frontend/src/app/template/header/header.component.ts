import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { environment } from 'src/environment/environment';

import { SignalService } from '@server/core/services/signal.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [MatButtonModule, MatIconModule, NgOptimizedImage],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  protected imgURL = `${environment.baseImgURL}template/`;
  protected signalService: SignalService = inject(SignalService);

  toggleEdit(): void {
    const editToggle = this.signalService.editEnabled();
    this.signalService.editEnabled.set(!editToggle);
  }
}
