export type ICropArea = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type ImageCropBoxData = {
  rotate: number;
  scaleX: number;
  scaleY: number;
  x: string;
  y: string;
  width: string;
  height: string;
};

export type ImageEditBody = {
  file?: string;
  saveTo?: string;
  cropBoxData?: ImageCropBoxData;
};
