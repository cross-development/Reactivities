import { useCallback, FC, memo } from 'react';
import { useDropzone } from 'react-dropzone';
import { Header, Icon } from 'semantic-ui-react';

interface Props {
  onSetFiles: (files: (File & { preview: string })[]) => void;
}

const PhotoWidgetDropzone: FC<Props> = memo(({ onSetFiles }) => {
  const dzStyles = {
    border: '3px dashed #eee',
    borderColor: '#eee',
    borderRadius: '5px',
    paddingTop: '30px',
    textAlign: 'center',
    height: 200,
  } as const;

  const dzActive = {
    borderColor: 'green',
  } as const;

  const onDrop = useCallback(
    (acceptedFiles: File[]): void => {
      const modifiedFiles = acceptedFiles.map(file =>
        Object.assign(file, { preview: URL.createObjectURL(file) }),
      );

      onSetFiles(modifiedFiles);
    },
    [onSetFiles],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      style={isDragActive ? { ...dzStyles, ...dzActive } : dzStyles}
    >
      <input {...getInputProps()} />

      <Icon
        size="huge"
        name="upload"
      />

      <Header content="Drop image here" />
    </div>
  );
});

PhotoWidgetDropzone.displayName = 'PhotoWidgetDropzone';

export default PhotoWidgetDropzone;
