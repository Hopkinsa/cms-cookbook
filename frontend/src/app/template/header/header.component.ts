import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { AdminLinkBarComponent } from "../admin-link-bar/admin-link-bar.component";
import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [AdminLinkBarComponent, NgOptimizedImage],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  protected imgURL = `${environment.baseTemplateURL}`;
}
