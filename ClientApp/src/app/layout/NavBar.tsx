import { FC, memo } from 'react';
import { Button, Container, Menu } from 'semantic-ui-react';
import { useStore } from '../stores/store';

const NavBar: FC = memo(() => {
  const { activityStore } = useStore();

  const handleOpenForm = (): void => activityStore.openForm();

  return (
    <Menu
      inverted
      fixed="top"
    >
      <Container>
        <Menu.Item header>
          <img
            alt="logo"
            src="/assets/logo.png"
            style={{ marginRight: '.625rem' }}
          />
          Reactivities
        </Menu.Item>

        <Menu.Item name="Activities" />

        <Menu.Item>
          <Button
            positive
            content="Create Activity"
            onClick={handleOpenForm}
          />
        </Menu.Item>
      </Container>
    </Menu>
  );
});

NavBar.displayName = 'NavBar';

export default NavBar;
