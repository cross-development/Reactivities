import { FC, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Grid, Header, Tab } from 'semantic-ui-react';

import { useStore } from '../../app/stores/store';
import ProfileEditForm from './ProfileEditForm';

const ProfileAbout: FC = observer(() => {
  const [editMode, setEditMode] = useState(false);

  const {
    profileStore: { isCurrentUser, profile },
  } = useStore();

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header
            icon="user"
            floated="left"
            content={`About ${profile?.displayName}`}
          />

          {isCurrentUser && (
            <Button
              basic
              floated="right"
              content={editMode ? 'Cancel' : 'Edit Profile'}
              onClick={() => setEditMode(prevState => !prevState)}
            />
          )}
        </Grid.Column>

        <Grid.Column width={16}>
          {editMode ? (
            <ProfileEditForm setEditMode={setEditMode} />
          ) : (
            <span style={{ whiteSpace: 'pre-wrap' }}>{profile?.bio}</span>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
});

ProfileAbout.displayName = 'ProfileAbout';

export default ProfileAbout;
