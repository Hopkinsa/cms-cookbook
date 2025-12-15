import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { SignalService } from '@server/core/services/signal.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    MatButtonModule,
    MatIconModule
  ],
  standalone: true,
})
export class HeaderComponent {
  protected signalService: SignalService = inject(SignalService);

  toggleEdit(): void {
    const editToggle = this.signalService.editEnabled();
    this.signalService.editEnabled.set(!editToggle);
  }
}
