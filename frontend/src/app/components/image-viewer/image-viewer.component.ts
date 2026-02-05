import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, model } from '@angular/core';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss'],
  imports: [CommonModule,],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageViewerComponent {
  readonly imgView = model(false);
  readonly imgSrc = model('');
  readonly caption = model('');

  close(): void {
    this.imgView.set(false);
    this.imgSrc.set('');
    this.caption.set('');
  }
}
