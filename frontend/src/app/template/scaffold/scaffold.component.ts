import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from '../header/header.component'
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-template',
  templateUrl: './scaffold.component.html',
  styleUrls: ['./scaffold.component.scss'],
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent
  ],
  standalone: true,
})
export class ScaffoldLayoutComponent {
}
