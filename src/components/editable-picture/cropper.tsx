import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import ReactCrop, { Crop, PixelCrop, convertToPixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useDebounceEffect } from './use-debounce-effect';
import { canvasPreview } from './canvas-preview';
import { centerAspectCrop } from './center-aspect-crop';

export interface CropperProps {
  src: string;
  onDone?: (url: string) => void;
  onClose?: () => void;
}

export function Cropper({ src, onClose, onDone }: CropperProps) {
  const [crop, setCrop] = useState<Crop>({ unit: '%', width: 50, height: 50, x: 25, y: 25 });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);

  const [aspect] = useState(1);
  const [scale] = useState(1);
  const [rotate] = useState(0);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      const corpValue = centerAspectCrop(width, height, aspect);
      setCrop(corpValue);
      setCompletedCrop(convertToPixelCrop(corpValue, width, height));
    }
  }

  function handleCancelClick() {
    onClose?.();
  }

  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const blobUrlRef = useRef('');
  async function handleConfirmClick() {
    const image = imgRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!image || !previewCanvas || !completedCrop) {
      throw new Error('Crop canvas does not exist');
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const offscreen = new OffscreenCanvas(completedCrop.width * scaleX, completedCrop.height * scaleY);
    const ctx = offscreen.getContext('2d');
    if (!ctx) {
      throw new Error('No 2d context');
    }

    ctx.drawImage(
      previewCanvas,
      0,
      0,
      previewCanvas.width,
      previewCanvas.height,
      0,
      0,
      offscreen.width,
      offscreen.height,
    );

    // NOTE: As we store the images in the database as a temporary solution, they should be compressed as much as possible
    const blob = await offscreen.convertToBlob({
      type: 'image/webp',
      quality: 0.1,
    });

    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
    }
    blobUrlRef.current = URL.createObjectURL(blob);

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) onDone?.(reader.result as string);
    };
    reader.readAsDataURL(blob);
  }

  useDebounceEffect(
    () => {
      if (completedCrop?.width && completedCrop?.height && imgRef.current && previewCanvasRef.current) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop, scale, rotate);
      }
    },
    100,
    [completedCrop, scale, rotate],
  );

  return createPortal(
    <div className="relative z-10">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden w-full rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-black px-4 pb-4 pt-5 sm:p-6 sm:pb-4 w-full">
              <ReactCrop
                className=""
                keepSelection
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspect}
                minHeight={100}>
                <img
                  ref={imgRef}
                  alt="Crop me"
                  src={src}
                  style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                  onLoad={onImageLoad}
                />
              </ReactCrop>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                onClick={handleConfirmClick}
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 sm:ml-3 sm:w-auto">
                Confirm
              </button>
              <button
                onClick={handleCancelClick}
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">
                Cancel
              </button>
            </div>
            <canvas
              className="hidden"
              ref={previewCanvasRef}
              style={{
                objectFit: 'contain',
                width: completedCrop?.width,
                height: completedCrop?.height,
              }}
            />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
