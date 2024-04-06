import { FC } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Image, List, Popup } from 'semantic-ui-react';

import { IProfile } from '../../../app/models/profile';
import ProfileCard from '../../profiles/ProfileCard';

interface Props {
  attendees: IProfile[];
}

const ActivityListItemAttendee: FC<Props> = observer(({ attendees }) => {
  const styles = {
    borderColor: 'orange',
    borderWidth: 3,
  };

  return (
    <List horizontal>
      {attendees.map(attendee => (
        <Popup
          key={attendee.username}
          hoverable
          trigger={
            <List.Item
              as={Link}
              to={`/profiles/${attendee.username}`}
            >
              <Image
                bordered
                circular
                size="mini"
                src={attendee.image || '/assets/user.png'}
                style={attendee.following ? styles : null}
              />
            </List.Item>
          }
        >
          <Popup.Content>
            <ProfileCard profile={attendee} />
          </Popup.Content>
        </Popup>
      ))}
    </List>
  );
});

ActivityListItemAttendee.displayName = 'ActivityListItemAttendee';

export default ActivityListItemAttendee;
