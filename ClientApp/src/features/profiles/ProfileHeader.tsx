import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Divider, Grid, Header, Item, Reveal, Segment, Statistic } from 'semantic-ui-react';

import { IProfile } from '../../app/models/profile';

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
            value="5"
          />
          <Statistic
            label="Following"
            value="42"
          />
        </Statistic.Group>

        <Divider />

        <Reveal animated="move">
          <Reveal.Content
            visible
            style={{ width: '100%' }}
          >
            <Button
              fluid
              color="teal"
              content="Following"
            />
          </Reveal.Content>

          <Reveal.Content
            visible
            style={{ width: '100%' }}
          >
            <Button
              fluid
              basic
              color={true ? 'red' : 'green'}
              content={true ? 'Unfollow' : 'Follow'}
            />
          </Reveal.Content>
        </Reveal>
      </Grid.Column>
    </Grid>
  </Segment>
));

ProfileHeader.displayName = 'ProfileHeader';

export default ProfileHeader;
