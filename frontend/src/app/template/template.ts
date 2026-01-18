import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ScaffoldLayoutComponent } from './scaffold/scaffold.component';
@Component({
  templateUrl: './template.html',
  imports: [ScaffoldLayoutComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Template {}
