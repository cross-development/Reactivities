import { FC, Fragment } from 'react';
import { Segment, Button, Placeholder } from 'semantic-ui-react';

const ActivityListItemPlaceholder: FC = () => (
  <Fragment>
    <Placeholder
      fluid
      style={{ marginTop: 25 }}
    >
      <Segment.Group>
        <Segment style={{ minHeight: 110 }}>
          <Placeholder>
            <Placeholder.Header image>
              <Placeholder.Line />
              <Placeholder.Line />
            </Placeholder.Header>

            <Placeholder.Paragraph>
              <Placeholder.Line />
            </Placeholder.Paragraph>
          </Placeholder>
        </Segment>

        <Segment>
          <Placeholder>
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder>
        </Segment>

        <Segment
          secondary
          style={{ minHeight: 70 }}
        />

        <Segment clearing>
          <Button
            disabled
            color="blue"
            content="View"
            floated="right"
          />
        </Segment>
      </Segment.Group>
    </Placeholder>
  </Fragment>
);

ActivityListItemPlaceholder.displayName = 'ActivityListItemPlaceholder';

export default ActivityListItemPlaceholder;
