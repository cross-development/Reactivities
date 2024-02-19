import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { Header, Segment, Image, Item, Button } from 'semantic-ui-react';

import { Activity } from '../../../app/models/activity';

interface Props {
  activity: Activity;
}

const ActivityDetailedHeader: FC<Props> = observer(({ activity }) => (
  <Segment.Group>
    <Segment
      basic
      attached="top"
      style={{ padding: '0' }}
    >
      <Image
        fluid
        src={`/assets/categoryImages/${activity.category}.jpg`}
        style={{ filter: 'brightness(30%)' }}
      />

      <Segment
        basic
        style={{
          position: 'absolute',
          bottom: '5%',
          left: '5%',
          width: '100%',
          height: 'auto',
          color: 'white',
        }}
      >
        <Item.Group>
          <Item>
            <Item.Content>
              <Header
                size="huge"
                content={activity.title}
                style={{ color: 'white' }}
              />

              <p>{activity.date}</p>
              <p>
                Hosted by <strong>Bob</strong>
              </p>
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
    </Segment>

    <Segment
      clearing
      attached="bottom"
    >
      <Button color="teal">Join Activity</Button>

      <Button>Cancel attendance</Button>

      <Button
        color="orange"
        floated="right"
      >
        Manage Event
      </Button>
    </Segment>
  </Segment.Group>
));

ActivityDetailedHeader.displayName = 'ActivityDetailedHeader';

export default ActivityDetailedHeader;
