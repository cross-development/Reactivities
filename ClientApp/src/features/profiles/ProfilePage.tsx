import { FC, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Grid } from 'semantic-ui-react';
import { useParams } from 'react-router-dom';

import Loader from '../../app/layout/Loader';
import { useStore } from '../../app/stores/store';
import ProfileHeader from './ProfileHeader';
import ProfileContent from './ProfileContent';

const ProfilePage: FC = observer(() => {
  const { username } = useParams();

  const {
    profileStore: { loadProfile, loadingProfile, profile, setActiveTab },
  } = useStore();

  useEffect(() => {
    if (username) {
      loadProfile(username);
    }

    return () => {
      setActiveTab(0);
    };
  }, [loadProfile, setActiveTab, username]);

  if (loadingProfile) {
    return <Loader content="Loading profile..." />;
  }

  return (
    <Grid>
      <Grid.Column width={16}>
        {profile && (
          <>
            <ProfileHeader profile={profile} />

            <ProfileContent profile={profile} />
          </>
        )}
      </Grid.Column>
    </Grid>
  );
});

ProfilePage.displayName = 'ProfilePage';

export default ProfilePage;
