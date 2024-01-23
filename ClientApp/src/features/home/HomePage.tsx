import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

const HomePage = memo(() => {
  return (
    <Container style={{ marginTop: '7rem' }}>
      <h1>HomePage</h1>

      <h3>
        Go to <Link to="/activities">Activities</Link>
      </h3>
    </Container>
  );
});

HomePage.displayName = 'HomePage';

export default HomePage;
