import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnDestroy,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { form, FormField } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { environment } from 'src/environment/environment';
import {
  CropperPosition,
  ImageCroppedEvent,
  ImageTransform,
  LoadedImage,
  ImageCropperComponent as NgxImageCropperComponent,
} from 'ngx-image-cropper';

import { FileService, SignalService } from '@server/core/services';

type CropBoxData = {
  rotate: number;
  scaleX: number;
  scaleY: number;
  x: string;
  y: string;
  width: string;
  height: string;
};

const DEFAULT_TRANSFORM: ImageTransform = {
  scale: 1,
  rotate: 0,
  flipH: false,
  flipV: false,
};

const MIN_CROPPER_SIZE = 20;

@Component({
  selector: 'app-image-amend',
  templateUrl: './image-amend.component.html',
  imports: [CommonModule, MatButtonModule, MatIconModule, FormField, NgxImageCropperComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ImageAmendComponent implements OnDestroy {
  readonly signalIconImage = input<string>('', {
    alias: 'imageIcon',
  });
  readonly signalBannerImage = input<string>('', {
    alias: 'imageBanner',
  });
  readonly signalImageOrig = input<string>('', {
    alias: 'imageOrig',
  });
  protected imgUrl = `${environment.baseImgURL}`;
  protected signalService: SignalService = inject(SignalService);
  protected fileService: FileService = inject(FileService);

  readonly imgIconSrc = computed(() => `${this.imgUrl}${this.signalIconImage()}` || '');
  readonly imgBannerSrc = computed(() => `${this.imgUrl}${this.signalBannerImage()}` || '');
  readonly imgOrigSrc = computed(() => `${this.imgUrl}${this.signalImageOrig()}` || '');
  readonly imageCropper = viewChild(NgxImageCropperComponent);
  readonly imgWidth = signal(0);
  readonly imgHeight = signal(0);
  readonly cropWidth = signal(0);
  readonly cropHeight = signal(0);
  readonly previewSrc = signal('');
  readonly maintainAspectRatio = signal(false);
  readonly selectedAspectRatio = signal<number | null>(null);
  readonly cropperAspectRatio = signal(1);
  readonly allowMoveImage = signal(false);
  readonly transform = signal<ImageTransform>({ ...DEFAULT_TRANSFORM });
  readonly cropperOverride = signal<CropperPosition | undefined>(undefined);

  readonly formModel = signal<{ targetImage: string }>({ targetImage: 'icon' });
  protected formTarget = form(this.formModel);

  private currentCropEvent: ImageCroppedEvent | null = null;
  private currentCropperPosition: CropperPosition | null = null;
  private initialCropperPosition: CropperPosition | null = null;
  private previewObjectUrl: string | null = null;

  ngOnDestroy(): void {
    this.revokePreviewObjectUrl();
  }

  imageLoaded(image: LoadedImage): void {
    this.imgWidth.set(Math.round(image.original.size.width));
    this.imgHeight.set(Math.round(image.original.size.height));
  }

  imageCropped(event: ImageCroppedEvent): void {
    this.currentCropEvent = event;
    this.cropWidth.set(Math.round(event.imagePosition.x2 - event.imagePosition.x1));
    this.cropHeight.set(Math.round(event.imagePosition.y2 - event.imagePosition.y1));
    this.setPreviewSource(event.objectUrl ?? event.base64 ?? '');
  }

  cropperChanged(position: CropperPosition): void {
    const nextPosition = this.cloneCropperPosition(position);
    this.currentCropperPosition = nextPosition;
    if (this.initialCropperPosition === null) {
      this.initialCropperPosition = nextPosition;
    }
  }

  transformChanged(transform: ImageTransform): void {
    this.transform.set({ ...this.transform(), ...transform });
  }

  scaleDown(): void {
    const currentScale = this.transform().scale ?? 1;
    this.updateTransform({ scale: Math.max(0.1, currentScale - 0.05) });
  }

  scaleUp(): void {
    const currentScale = this.transform().scale ?? 1;
    this.updateTransform({ scale: currentScale + 0.05 });
  }

  zoomOut(): void {
    this.scaleCropper(1.05);
  }

  zoomIn(): void {
    this.scaleCropper(0.95);
  }

  rotateLeft(): void {
    this.updateTransform({ rotate: (this.transform().rotate ?? 0) + 90 });
  }

  rotateRight(): void {
    this.updateTransform({ rotate: (this.transform().rotate ?? 0) - 90 });
  }

  flipH(): void {
    this.updateTransform({ flipH: !(this.transform().flipH ?? false) });
  }

  flipV(): void {
    this.updateTransform({ flipV: !(this.transform().flipV ?? false) });
  }

  aspectRatio(which: number): void {
    const ratio = [16 / 9, 4 / 3, 1, 0, 5 / 3, 14 / 3];
    const selectedRatio = ratio[which];

    if (selectedRatio === 0) {
      this.selectedAspectRatio.set(null);
      this.maintainAspectRatio.set(false);
      return;
    }

    this.selectedAspectRatio.set(which);
    this.cropperAspectRatio.set(selectedRatio);
    this.maintainAspectRatio.set(true);
  }

  selectBox(): void {
    this.allowMoveImage.set(false);
  }

  drag(): void {
    this.allowMoveImage.set(true);
  }

  reset(): void {
    this.selectedAspectRatio.set(null);
    this.maintainAspectRatio.set(false);
    this.cropperAspectRatio.set(1);
    this.allowMoveImage.set(false);
    this.transform.set({ ...DEFAULT_TRANSFORM });
    this.cropperOverride.set(this.cloneCropperPosition(this.initialCropperPosition) ?? undefined);
  }

  apply(): void {
    if (!this.currentCropEvent) {
      return;
    }

    const cropBoxData = this.toCropBoxData(this.currentCropEvent);
    const imgName = this.signalImageOrig();
    const imgSave = this.formModel().targetImage === 'icon' ? this.signalIconImage() : this.signalBannerImage();

    this.fileService
      .editImage({
        file: imgName,
        saveTo: imgSave,
        cropBoxData: cropBoxData,
      })
      .subscribe(
        (res: HttpEvent<unknown>) => {
          if (res.type === HttpEventType.Response) {
            this.signalService.feedbackMessage.set({ type: 'success', message: 'Image added' });
          }
        },
        (error: unknown) => {
          console.error('Upload error:', error);
          this.signalService.feedbackMessage.set({ type: 'error', message: 'Image upload failed' });
        },
      );
  }

  private updateTransform(transform: Partial<ImageTransform>): void {
    this.transform.set({ ...this.transform(), ...transform });
  }

  private scaleCropper(factor: number): void {
    if (!this.currentCropperPosition) {
      return;
    }

    const width = this.currentCropperPosition.x2 - this.currentCropperPosition.x1;
    const height = this.currentCropperPosition.y2 - this.currentCropperPosition.y1;
    const centerX = this.currentCropperPosition.x1 + width / 2;
    const centerY = this.currentCropperPosition.y1 + height / 2;
    const nextWidth = Math.max(MIN_CROPPER_SIZE, width * factor);
    const nextHeight = Math.max(MIN_CROPPER_SIZE, height * factor);

    this.cropperOverride.set({
      x1: centerX - nextWidth / 2,
      y1: centerY - nextHeight / 2,
      x2: centerX + nextWidth / 2,
      y2: centerY + nextHeight / 2,
    });
  }

  private toCropBoxData(event: ImageCroppedEvent): CropBoxData {
    const imagePosition = event.offsetImagePosition ?? event.imagePosition;
    const scale = this.transform().scale ?? 1;

    return {
      rotate: this.transform().rotate ?? 0,
      scaleX: (this.transform().flipH ? -1 : 1) * scale,
      scaleY: (this.transform().flipV ? -1 : 1) * scale,
      x: Math.round(imagePosition.x1).toString(),
      y: Math.round(imagePosition.y1).toString(),
      width: Math.max(1, Math.round(imagePosition.x2 - imagePosition.x1)).toString(),
      height: Math.max(1, Math.round(imagePosition.y2 - imagePosition.y1)).toString(),
    };
  }

  private setPreviewSource(source: string): void {
    if (this.previewObjectUrl && this.previewObjectUrl !== source) {
      URL.revokeObjectURL(this.previewObjectUrl);
      this.previewObjectUrl = null;
    }

    if (source.startsWith('blob:')) {
      this.previewObjectUrl = source;
    }

    this.previewSrc.set(source);
  }

  private revokePreviewObjectUrl(): void {
    if (!this.previewObjectUrl) {
      return;
    }

    URL.revokeObjectURL(this.previewObjectUrl);
    this.previewObjectUrl = null;
  }

  private cloneCropperPosition(position: CropperPosition | null): CropperPosition | null {
    if (!position) {
      return null;
    }

    return {
      x1: position.x1,
      y1: position.y1,
      x2: position.x2,
      y2: position.y2,
    };
  }
}
