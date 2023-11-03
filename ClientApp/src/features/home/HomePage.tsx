import { memo } from 'react';
import { Container } from 'semantic-ui-react';

const HomePage = memo(() => {
  return <Container style={{ marginTop: '7rem' }}>HomePage</Container>;
});

HomePage.displayName = 'HomePage';

export default HomePage;
