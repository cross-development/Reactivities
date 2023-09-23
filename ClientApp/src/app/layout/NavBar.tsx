import { FC, memo } from 'react';
import { Button, Container, Menu } from 'semantic-ui-react';

interface Props {
  onOpenForm: () => void;
}

const NavBar: FC<Props> = memo(({ onOpenForm }) => (
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
          onClick={onOpenForm}
        />
      </Menu.Item>
    </Container>
  </Menu>
));

NavBar.displayName = 'NavBar';

export default NavBar;
