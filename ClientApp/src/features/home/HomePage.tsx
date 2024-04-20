import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Container, Header, Segment, Image, Button, Divider } from 'semantic-ui-react';
import FacebookLogin, { SuccessResponse } from '@greatsumini/react-facebook-login';
import { observer } from 'mobx-react-lite';

import { useStore } from '../../app/stores/store';
import LoginForm from '../users/LoginForm';
import RegisterForm from '../users/RegisterForm';

const HomePage: FC = observer(() => {
  const { userStore, modalStore } = useStore();

  const handleSuccessFacebookLogin = (res: SuccessResponse): void => {
    userStore.facebookLogin(res.accessToken);
  };

  const handleFailureFacebookLogin = (): void => {
    console.log('Facebook login failed!');
  };

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
              onClick={() => modalStore.openModal(<RegisterForm />)}
            >
              Register
            </Button>

            <Divider
              inverted
              horizontal
            >
              Or
            </Divider>

            <FacebookLogin
              appId="304071589381005"
              onFail={handleFailureFacebookLogin}
              onSuccess={handleSuccessFacebookLogin}
              className={`ui button facebook huge inverted ${userStore.fbLoading && 'loading'}`}
            />
          </>
        )}
      </Container>
    </Segment>
  );
});

HomePage.displayName = 'HomePage';

export default HomePage;
