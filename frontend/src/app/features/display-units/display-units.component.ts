import { KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

import { SignalService } from '@server/core/services/signal.service';
import { GroupByPipe } from '@server/shared/pipes/group-by.pipe';

@Component({
  selector: 'app-display-units',
  templateUrl: './display-units.component.html',
  styleUrls: ['./display-units.component.scss'],
  standalone: true,
  imports: [MatButtonModule, GroupByPipe, KeyValuePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisplayUnitsComponent {
  private router: Router = inject(Router);
  protected signalService: SignalService = inject(SignalService);

  back(): void {
    this.router.navigate(['/']);
  }
}
