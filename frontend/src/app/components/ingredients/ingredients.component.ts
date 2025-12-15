import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { SignalService } from '@server/core/services/signal.service';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.scss'],
  standalone: true,
  imports: [DecimalPipe],
  animations: [],
})
export class IngredientsComponent {
  protected signalService: SignalService = inject(SignalService);
}
