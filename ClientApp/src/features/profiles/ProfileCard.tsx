import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { Card, Icon, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { Profile } from '../../app/models/profile';
import FollowButton from './FollowButton';

interface Props {
  profile: Profile;
}

const ProfileCard: FC<Props> = observer(({ profile }) => (
  <Card
    as={Link}
    to={`/profiles/${profile.username}`}
  >
    <Image src={profile.image || '/assets/user.png'} />

    <Card.Content>
      <Card.Header>{profile.displayName}</Card.Header>

      <Card.Description>Bio goes here</Card.Description>
    </Card.Content>

    <Card.Content extra>
      <Icon name="user" />
      {profile.followersCount} Followers
    </Card.Content>

    <FollowButton profile={profile} />
  </Card>
));

ProfileCard.displayName = 'ProfileCard';

export default ProfileCard;
