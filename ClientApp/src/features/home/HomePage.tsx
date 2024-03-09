import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Container, Header, Segment, Image, Button } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';

import { useStore } from '../../app/stores/store';
import LoginForm from '../users/LoginForm';

const HomePage: FC = () => {
  const { userStore, modalStore } = useStore();

  return (
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

        {userStore.isLoggedIn ? (
          <>
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
              Go to Activities!
            </Button>
          </>
        ) : (
          <>
            <Button
              inverted
              size="huge"
              onClick={() => modalStore.openModal(<LoginForm />)}
            >
              Login
            </Button>

            <Button
              inverted
              size="huge"
              onClick={() => modalStore.openModal(<></>)}
            >
              Register
            </Button>
          </>
        )}
      </Container>
    </Segment>
  );
};

HomePage.displayName = 'HomePage';

export default observer(HomePage);
