import { FC } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Image, List } from 'semantic-ui-react';

import { IProfile } from '../../../app/models/profile';

interface Props {
  attendees: IProfile[];
}

const ActivityListItemAttendee: FC<Props> = ({ attendees }) => (
  <List horizontal>
    {attendees.map(attendee => (
      <List.Item
        key={attendee.username}
        as={Link}
        to={`/profile/${attendee.username}`}
      >
        <Image
          circular
          size="mini"
          src={attendee.image || '/assets/user.png'}
        />
      </List.Item>
    ))}
  </List>
);

ActivityListItemAttendee.displayName = 'ActivityListItemAttendee';

export default observer(ActivityListItemAttendee);
