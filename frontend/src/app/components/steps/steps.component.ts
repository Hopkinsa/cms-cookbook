import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { SignalService } from '@server/core/services/signal.service';

@Component({
  selector: 'app-steps',
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.scss'],
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepsComponent {
  protected signalService: SignalService = inject(SignalService);
}
