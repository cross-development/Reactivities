import { FC, memo } from 'react';
import { Link } from 'react-router-dom';
import { Button, Header, Icon, Segment } from 'semantic-ui-react';

const NotFound: FC = memo(() => (
  <Segment placeholder>
    <Header icon>
      <Icon name="search" />
      Oops - we've looked everywhere but could not find what you are looking for!
    </Header>

    <Segment.Inline>
      <Button
        as={Link}
        to="/activities"
      >
        Return to activities page
      </Button>
    </Segment.Inline>
  </Segment>
));

NotFound.displayName = 'NotFound';

export default NotFound;
