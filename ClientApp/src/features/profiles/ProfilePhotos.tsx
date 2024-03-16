import { FC, useState, MouseEvent } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Card, Grid, Header, Image, Tab } from 'semantic-ui-react';

import { IPhoto, IProfile } from '../../app/models/profile';
import { useStore } from '../../app/stores/store';
import PhotoUploadWidget from '../../app/common/imageUpload/PhotoUploadWidget';

interface Props {
  profile: IProfile;
}

const ProfilePhotos: FC<Props> = observer(({ profile }) => {
  const [addPhotoMode, setAddPhotoMode] = useState<boolean>(false);
  const [target, setTarget] = useState<string>('');

  const {
    profileStore: { isCurrentUser, uploading, loading, uploadPhoto, setMainPhoto, deletePhoto },
  } = useStore();

  const handlePhotoUpload = (file: Blob): void => {
    uploadPhoto(file).then(() => setAddPhotoMode(false));
  };

  const handleSetMainPhoto = (photo: IPhoto, e: MouseEvent<HTMLButtonElement>): void => {
    setTarget(e.currentTarget.name);
    setMainPhoto(photo);
  };

  const handleDeletePhoto = (photo: IPhoto, e: MouseEvent<HTMLButtonElement>): void => {
    setTarget(e.currentTarget.name);
    deletePhoto(photo);
  };

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header
            icon="image"
            floated="left"
            content="Photos"
          />

          {isCurrentUser && (
            <Button
              basic
              floated="right"
              content={addPhotoMode ? 'Cancel' : 'Add Photo'}
              onClick={() => setAddPhotoMode(prevState => !prevState)}
            />
          )}
        </Grid.Column>

        <Grid.Column width={16}>
          {addPhotoMode ? (
            <PhotoUploadWidget
              loading={uploading}
              onUploadPhoto={handlePhotoUpload}
            />
          ) : (
            <Card.Group itemsPerRow={5}>
              {profile.photos?.map(photo => (
                <Card key={photo.id}>
                  <Image src={photo.url} />

                  {isCurrentUser && (
                    <Button.Group
                      fluid
                      widths={2}
                    >
                      <Button
                        basic
                        color="green"
                        content="Main"
                        name={'main' + photo.id}
                        disabled={photo.isMain}
                        loading={target === 'main' + photo.id && loading}
                        onClick={e => handleSetMainPhoto(photo, e)}
                      />

                      <Button
                        basic
                        color="red"
                        icon="trash"
                        name={'delete' + photo.id}
                        disabled={photo.isMain}
                        loading={target === 'delete' + photo.id && loading}
                        onClick={e => handleDeletePhoto(photo, e)}
                      />
                    </Button.Group>
                  )}
                </Card>
              ))}
            </Card.Group>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
});

ProfilePhotos.displayName = 'ProfilePhotos';

export default ProfilePhotos;
