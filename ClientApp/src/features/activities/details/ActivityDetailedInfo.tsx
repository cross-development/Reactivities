import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { Grid, Icon, Segment } from 'semantic-ui-react';
import { format } from 'date-fns';

import { IActivity } from '../../../app/models/activity';

interface Props {
  activity: IActivity;
}

const ActivityDetailedInfo: FC<Props> = observer(({ activity }) => (
  <Segment.Group>
    <Segment attached="top">
      <Grid>
        <Grid.Column width={1}>
          <Icon
            name="info"
            size="large"
            color="teal"
          />
        </Grid.Column>

        <Grid.Column width={15}>
          <p>{activity.description}</p>
        </Grid.Column>
      </Grid>
    </Segment>

    <Segment attached>
      <Grid verticalAlign="middle">
        <Grid.Column width={1}>
          <Icon
            name="calendar"
            size="large"
            color="teal"
          />
        </Grid.Column>

        <Grid.Column width={15}>
          <span>{format(activity.date!, 'dd MMM yyyy h:mm aa')}</span>
        </Grid.Column>
      </Grid>
    </Segment>

    <Segment attached>
      <Grid verticalAlign="middle">
        <Grid.Column width={1}>
          <Icon
            name="marker"
            size="large"
            color="teal"
          />
        </Grid.Column>

        <Grid.Column width={11}>
          <span>
            {activity.venue}, {activity.city}
          </span>
        </Grid.Column>
      </Grid>
    </Segment>
  </Segment.Group>
));

ActivityDetailedInfo.displayName = 'ActivityDetailedInfo';

export default ActivityDetailedInfo;
