import { KeyValuePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

import { SignalService } from '@server/core/services/signal.service';
import { GroupByPipe } from '@server/shared/pipes/group-by.pipe';

@Component({
  selector: 'app-display-tags',
  templateUrl: './display-tags.component.html',
  styleUrls: ['./display-tags.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    RouterLink,
    GroupByPipe,
    KeyValuePipe,
  ],
  animations: [],
})
export class DisplayTagsComponent {
  private router: Router = inject(Router);
  protected signalService: SignalService = inject(SignalService);

  back(): void {
    this.router.navigate(['/']);
  }
}