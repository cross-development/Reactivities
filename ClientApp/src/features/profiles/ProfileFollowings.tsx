import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { Card, Grid, Header, Tab } from 'semantic-ui-react';

import { useStore } from '../../app/stores/store';
import ProfileCard from './ProfileCard';

const ProfileFollowings: FC = observer(() => {
  const {
    profileStore: { profile, followings, loadingFollowings, activeTab },
  } = useStore();

  return (
    <Tab.Pane loading={loadingFollowings}>
      <Grid>
        <Grid.Column width={16}>
          <Header
            icon="user"
            floated="left"
            content={
              activeTab === 3
                ? `People following ${profile!.displayName}`
                : `People ${profile?.displayName} is following`
            }
          />
        </Grid.Column>

        <Grid.Column width={16}>
          <Card.Group itemsPerRow={5}>
            {followings.map(profile => (
              <ProfileCard
                key={profile.username}
                profile={profile}
              />
            ))}
          </Card.Group>
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
});

ProfileFollowings.displayName = 'ProfileFollowings';

export default ProfileFollowings;
