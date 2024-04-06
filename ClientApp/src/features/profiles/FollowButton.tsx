import { FC, MouseEvent } from 'react';
import { observer } from 'mobx-react-lite';
import { Reveal, Button } from 'semantic-ui-react';

import { Profile } from '../../app/models/profile';
import { useStore } from '../../app/stores/store';

interface Props {
  profile: Profile;
}

const FollowButton: FC<Props> = observer(({ profile }) => {
  const {
    profileStore: { updateFollowing, loading },
    userStore,
  } = useStore();

  if (userStore.user?.username === profile.username) {
    return null;
  }

  const handleFollow = (e: MouseEvent<HTMLButtonElement>, username: string): void => {
    e.preventDefault();

    updateFollowing(username, !profile.following);
  };

  return (
    <Reveal animated="move">
      <Reveal.Content
        visible
        style={{ width: '100%' }}
      >
        <Button
          fluid
          color="teal"
          content={profile.following ? 'Following' : 'Not Following'}
        />
      </Reveal.Content>

      <Reveal.Content hidden>
        <Button
          fluid
          basic
          loading={loading}
          color={profile.following ? 'red' : 'green'}
          content={profile.following ? 'Unfollow' : 'Follow'}
          onClick={e => handleFollow(e, profile.username)}
        />
      </Reveal.Content>
    </Reveal>
  );
});

FollowButton.displayName = 'FollowButton';

export default FollowButton;
