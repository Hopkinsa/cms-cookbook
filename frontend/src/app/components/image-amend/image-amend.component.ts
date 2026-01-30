import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Field, form } from '@angular/forms/signals';
import { HttpEventType } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { environment } from 'src/environment/environment';
import Cropper from 'cropperjs';

import { FileService, SignalService } from '@server/core/services';

@Component({
  selector: 'app-image-amend',
  templateUrl: './image-amend.component.html',
  styleUrl: './image-amend.component.scss',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressBarModule, Field],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ImageAmendComponent {
  readonly signalIconImage = input<any>('', {
    alias: 'imageIcon',
  });
  readonly signalBannerImage = input<any>('', {
    alias: 'imageBanner',
  });
  readonly signalImageOrig = input<any>('', {
    alias: 'imageOrig',
  });
  protected imgUrl = `${environment.baseImgURL}`;
  protected signalService: SignalService = inject(SignalService);
  protected fileService: FileService = inject(FileService);

  readonly imgIconSrc = computed(() => `${this.imgUrl}${this.signalIconImage()}` || '');
  readonly imgBannerSrc = computed(() => `${this.imgUrl}${this.signalBannerImage()}` || '');
  readonly imgOrigSrc = computed(() => `${this.imgUrl}${this.signalImageOrig()}` || '');
  readonly imgType = computed(() => {
    const ext = this.signalImageOrig().slice(this.signalImageOrig().lastIndexOf('.') + 1);
    let type = 'image/';
    if (ext === 'jpg' || ext === 'jpeg') {
      type += 'jpg';
    } else if (ext === 'png') {
      type += 'png';
    } else {
      // fallback for unknown
      type += ext;
    }

    return type;
  });

  readonly imageElement = viewChild<ElementRef<HTMLImageElement>>('image');
  readonly imgWidth = signal(0);
  readonly imgHeight = signal(0);
  readonly cropWidth = signal(0);
  readonly cropHeight = signal(0);

  readonly formModel = signal<{ targetImage: string }>({ targetImage: 'icon' });
  protected formTarget = form(this.formModel);

  protected formData = new FormData();

  protected imageDestination = '';
  protected flipX = 1;
  protected flipY = 1;
  protected scaleX = 1;
  protected scaleY = 1;

  protected cropper: Cropper | undefined = undefined;
  private cropperConfig = {
    DragMode: 'move',
    ViewMode: 1,
    preview: '.previewImage',
    modal: true,
    background: true,
    movable: true,
    rotatable: true,
    scalable: true,
    dynamic: true,
    outlined: true,
    resizable: true,
    cropBoxMovable: true,
    cropBoxResizable: true,
    resize: false,
    ready: (): void => {
      this.imageData();
    },
    zoom: (): void => {
      this.imageData();
    },
    crop: (): void => {
      this.imageData();
    },
  };

  constructor() {
    effect(() => {
      this.imageElement()!.nativeElement.src = this.imgOrigSrc();
      this.cropper = new Cropper(this.imageElement()!.nativeElement, this.cropperConfig);
    });
  }

  imageData(): void {
    const imgData = this.cropper!.getImageData();
    const cropData = this.cropper!.getData();
    this.imgWidth.set(Math.round(imgData.naturalWidth));
    this.imgHeight.set(Math.round(imgData.naturalHeight));
    this.cropWidth.set(Math.round(cropData.width));
    this.cropHeight.set(Math.round(cropData.height));
  }

  scaleDown(): void {
    this.scaleX -= (0.05 * this.flipX);
    this.scaleY -= (0.05 * this.flipY);
    this.cropper!.scale(this.scaleX, this.scaleY);
    this.imageData();
  }

  scaleUp(): void {
    this.scaleX += (0.05 * this.flipX);
    this.scaleY += (0.05 * this.flipY);
    this.cropper!.scale(this.scaleX, this.scaleY);
    this.imageData();
  }

  zoomOut(): void {
    this.cropper!.zoom(-0.05);
  }

  zoomIn(): void {
    this.cropper!.zoom(0.05);
  }

  rotateLeft(): void {
    this.cropper!.rotate(90);
  }

  rotateRight(): void {
    this.cropper!.rotate(-90);
  }

  flipH(): void {
    this.flipX = -this.flipX;
    this.scaleX = -this.scaleX;
    this.cropper!.scale(this.scaleX, this.scaleY);
  }

  flipV(): void {
    this.flipY = -this.flipY;
    this.scaleY = -this.scaleY;
    this.cropper!.scale(this.scaleX, this.scaleY);
  }

  aspectRatio(which: number): void {
    const ratio = [16 / 9, 4 / 3, 1, 0, 5 / 3, 14 / 3];
    this.cropper!.setAspectRatio(ratio[which]);
    this.imageData();
  }

  selectBox(): void {
    this.cropper!.setDragMode('crop');
  }

  drag(): void {
    this.cropper!.setDragMode('move');
  }

  reset(): void {
    this.cropper!.setAspectRatio(0);
    this.cropper!.reset();
    this.imageData();
  }

  apply(): void {
    // Upload cropped image to server if the browser supports `HTMLCanvasElement.toBlob`.
    // The default value for the second parameter of `toBlob` is 'image/png', change it if necessary.
    const cropBoxData = this.cropper!.getCropBoxData();
    const imgName = this.formModel().targetImage === 'icon' ? this.signalIconImage() : this.signalBannerImage();

    this.cropper!.getCroppedCanvas({
      width: cropBoxData.width,
      height: cropBoxData.height,
      fillColor: '#fff',
      imageSmoothingEnabled: false,
      imageSmoothingQuality: 'high',
    }).toBlob(
      (blob) => {
        const formData = new FormData();

        // Pass the image file name as the third parameter if necessary.
        formData.append('file', blob as Blob, imgName);

        this.fileService.uploadImage(formData).subscribe(
          (res: any) => {
            if (res.type === HttpEventType.Response) {
              this.signalService.feedbackMessage.set({ type: 'success', message: 'Image added' });
            }
          },
          (error) => {
            console.error('Upload error:', error);
            this.signalService.feedbackMessage.set({ type: 'error', message: 'Image upload failed' });
          },
        );
      },
      this.imgType(),
      0.9,
    );
  }
}
