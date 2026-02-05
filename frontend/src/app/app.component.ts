import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'cookbook';

  faviconElement: HTMLLinkElement | null = null;

  constructor() {
    this.faviconElement = document.querySelector<HTMLLinkElement>('link[rel*="icon"]');
    if (this.faviconElement) {
      this.faviconElement.href = environment.baseTemplateURL + '/logo.svg';
    }
  }
}