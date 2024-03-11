import { FC } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Image, List, Popup } from 'semantic-ui-react';

import { IProfile } from '../../../app/models/profile';
import ProfileCard from '../../profiles/ProfileCard';

interface Props {
  attendees: IProfile[];
}

const ActivityListItemAttendee: FC<Props> = ({ attendees }) => (
  <List horizontal>
    {attendees.map(attendee => (
      <Popup
        key={attendee.username}
        hoverable
        trigger={
          <List.Item
            as={Link}
            to={`/profile/${attendee.username}`}
          >
            <Image
              circular
              size="mini"
              src={attendee.image || '/assets/user.png'}
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

ActivityListItemAttendee.displayName = 'ActivityListItemAttendee';

export default observer(ActivityListItemAttendee);
