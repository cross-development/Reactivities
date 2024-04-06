import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { Divider, Grid, Header, Item, Segment, Statistic } from 'semantic-ui-react';

import { IProfile } from '../../app/models/profile';
import FollowButton from './FollowButton';

interface Props {
  profile: IProfile;
}

const ProfileHeader: FC<Props> = observer(({ profile }) => (
  <Segment>
    <Grid>
      <Grid.Column width={12}>
        <Item.Group>
          <Item>
            <Item.Image
              avatar
              size="small"
              src={profile?.image || 'assets/user.png'}
            />

            <Item.Content verticalAlign="middle">
              <Header
                as="h1"
                content={profile?.displayName}
              />
            </Item.Content>
          </Item>
        </Item.Group>
      </Grid.Column>

      <Grid.Column width={4}>
        <Statistic.Group widths={2}>
          <Statistic
            label="Followers"
            value={profile.followersCount}
          />

          <Statistic
            label="Following"
            value={profile.followingCount}
          />
        </Statistic.Group>

        <Divider />

        <FollowButton profile={profile} />
      </Grid.Column>
    </Grid>
  </Segment>
));

ProfileHeader.displayName = 'ProfileHeader';

export default ProfileHeader;
