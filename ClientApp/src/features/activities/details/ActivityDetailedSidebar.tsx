import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { Segment, List, Label, Item, Image } from 'semantic-ui-react';

const ActivityDetailedSidebar: FC = observer(() => (
  <>
    <Segment
      inverted
      secondary
      color="teal"
      attached="top"
      textAlign="center"
      style={{ border: 'none' }}
    >
      3 People Going
    </Segment>

    <Segment attached>
      <List
        relaxed
        divided
      >
        <Item style={{ position: 'relative' }}>
          <Label
            color="orange"
            ribbon="right"
            style={{ position: 'absolute' }}
          >
            Host
          </Label>

          <Image
            size="tiny"
            src={'/assets/user.png'}
          />

          <Item.Content verticalAlign="middle">
            <Item.Header as="h3">
              <Link to={`#`}>Bob</Link>
            </Item.Header>

            <Item.Extra style={{ color: 'orange' }}>Following</Item.Extra>
          </Item.Content>
        </Item>

        <Item style={{ position: 'relative' }}>
          <Image
            size="tiny"
            src={'/assets/user.png'}
          />

          <Item.Content verticalAlign="middle">
            <Item.Header as="h3">
              <Link to={`#`}>Tom</Link>
            </Item.Header>

            <Item.Extra style={{ color: 'orange' }}>Following</Item.Extra>
          </Item.Content>
        </Item>

        <Item style={{ position: 'relative' }}>
          <Image
            size="tiny"
            src={'/assets/user.png'}
          />

          <Item.Content verticalAlign="middle">
            <Item.Header as="h3">
              <Link to={`#`}>Sally</Link>
            </Item.Header>
          </Item.Content>
        </Item>
      </List>
    </Segment>
  </>
));

ActivityDetailedSidebar.displayName = 'ActivityDetailedSidebar';

export default ActivityDetailedSidebar;
