import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { environment } from 'src/environment/environment';

import { FileService, SignalService } from '@server/core/services';
import { generateFilename } from '@server/shared/helper/filename.helper';
import { ImageAmendComponent } from '@server/components/image-amend/image-amend.component';
import { FeedbackComponent } from '@server/components/feedback/feedback.component';

@Component({
  selector: 'app-amend-image',
  templateUrl: './amend-image.component.html',
  styleUrls: ['./amend-image.component.scss'],
  standalone: true,
  imports: [MatButtonModule, MatIconModule, FeedbackComponent, ImageAmendComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AmendImageComponent {
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  protected imgUrl = `${environment.baseImgURL}`;
  protected fileService: FileService = inject(FileService);
  protected signalService: SignalService = inject(SignalService);

  protected readonly imgName = signal('');
  protected readonly imgNameIcon = signal('');
  protected readonly imgNameBanner = signal('');

  constructor() {
    // Access route parameters
    this.route.params.subscribe((params) => {
      const name = params['name'];
      const imgNames = generateFilename(name);

      this.imgName.set(name);
      this.imgNameIcon.set(imgNames.icon);
      this.imgNameBanner.set(imgNames.banner);
    });
  }

  back(): void {
    this.router.navigate(['images']);
  }
}
