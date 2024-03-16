import { FC, memo } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

interface Props {
  imagePreview: string;
  onSetCropper: (cropper: Cropper) => void;
}

const PhotoWidgetCropper: FC<Props> = memo(({ imagePreview, onSetCropper }) => (
  <Cropper
    src={imagePreview}
    style={{ height: 200, width: '100%' }}
    initialAspectRatio={1}
    aspectRatio={1}
    preview=".img-preview"
    guides={false}
    viewMode={1}
    autoCropArea={1}
    background={false}
    onInitialized={onSetCropper}
  />
));

PhotoWidgetCropper.displayName = 'PhotoWidgetCropper';

export default PhotoWidgetCropper;
