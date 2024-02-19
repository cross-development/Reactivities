import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Container, Header, Segment, Image, Button } from 'semantic-ui-react';

const HomePage = memo(() => (
  <Segment
    vertical
    inverted
    textAlign="center"
    className="masthead"
  >
    <Container text>
      <Header
        inverted
        as="h1"
      >
        <Image
          size="massive"
          alt="logo"
          src="/assets/logo.png"
          style={{ marginBottom: 12 }}
        />
        Reactivities
      </Header>

      <Header
        inverted
        as="h2"
        content="Welcome to Reactivities"
      />

      <Button
        inverted
        as={Link}
        to="/activities"
        size="huge"
      >
        Take me to the Activities!
      </Button>
    </Container>
  </Segment>
));

HomePage.displayName = 'HomePage';

export default HomePage;
