import { Component, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { MatButtonModule } from '@angular/material/button';
import { environment } from 'src/environment/environment';

import { SignalService } from '@server/core/services/signal.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    MatButtonModule
  ],
  animations: [],
})
export class HomeComponent {
  protected imgURL = `${ environment.baseImgURL }template/`;
  protected signalService: SignalService = inject(SignalService);
}
