import { FC, memo } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Button, Container, Menu } from 'semantic-ui-react';

const NavBar: FC = memo(() => (
  <Menu
    inverted
    fixed="top"
  >
    <Container>
      <Menu.Item
        header
        to="/"
        as={Link}
      >
        <img
          alt="logo"
          src="/assets/logo.png"
          style={{ marginRight: '.625rem' }}
        />
        Reactivities
      </Menu.Item>

      <Menu.Item
        to="/activities"
        name="Activities"
        as={NavLink}
      />

      <Menu.Item
        to="/errors"
        name="Errors"
        as={NavLink}
      />

      <Menu.Item>
        <Button
          positive
          content="Create Activity"
          to="/create-activity"
          as={NavLink}
        />
      </Menu.Item>
    </Container>
  </Menu>
));

NavBar.displayName = 'NavBar';

export default NavBar;
