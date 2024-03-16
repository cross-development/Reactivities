import { FC, useEffect, useState, memo } from 'react';
import { Button, Grid, Header } from 'semantic-ui-react';

import PhotoWidgetDropzone from './PhotoWidgetDropzone';
import PhotoWidgetCropper from './PhotoWidgetCropper';

interface Props {
  loading: boolean;
  onUploadPhoto: (file: Blob) => void;
}

const PhotoUploadWidget: FC<Props> = memo(({ loading, onUploadPhoto }) => {
  const [cropper, setCropper] = useState<Cropper>();
  const [files, setFiles] = useState<(File & { preview: string })[]>([]);

  useEffect(() => {
    return () => {
      files.forEach(file => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  const onCrop = (): void => {
    if (cropper) {
      cropper.getCroppedCanvas().toBlob(blob => onUploadPhoto(blob!));
    }
  };

  const onCancel = (): void => setFiles([]);

  const hasDroppedFile = files && files.length > 0;

  return (
    <Grid>
      <Grid.Column width={4}>
        <Header
          color="teal"
          content="Step 1 - Add Photo"
        />

        <PhotoWidgetDropzone onSetFiles={setFiles} />
      </Grid.Column>

      <Grid.Column width={1} />

      <Grid.Column width={4}>
        <Header
          color="teal"
          content="Step 2 - Resize Image"
        />

        {hasDroppedFile && (
          <PhotoWidgetCropper
            imagePreview={files[0].preview}
            onSetCropper={setCropper}
          />
        )}
      </Grid.Column>

      <Grid.Column width={1} />

      <Grid.Column width={4}>
        <Header
          color="teal"
          content="Step 1 - Preview & Upload"
        />

        {hasDroppedFile && (
          <>
            <div
              className="img-preview"
              style={{ minHeight: 200, overflow: 'hidden' }}
            />

            <Button.Group widths={2}>
              <Button
                positive
                icon="check"
                loading={loading}
                onClick={onCrop}
              />

              <Button
                icon="close"
                disabled={loading}
                onClick={onCancel}
              />
            </Button.Group>
          </>
        )}
      </Grid.Column>
    </Grid>
  );
});

PhotoUploadWidget.displayName = 'PhotoUploadWidget';

export default PhotoUploadWidget;
