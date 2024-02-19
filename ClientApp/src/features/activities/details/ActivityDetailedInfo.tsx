import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { Grid, Icon, Segment } from 'semantic-ui-react';

import { Activity } from '../../../app/models/activity';

interface Props {
  activity: Activity;
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
          <span>{activity.date}</span>
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
