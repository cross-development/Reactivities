import { FC } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Button, Container, Dropdown, Image, Menu } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';

import { useStore } from '../../app/stores/store';

const NavBar: FC = observer(() => {
  const {
    userStore: { user, logout },
  } = useStore();

  return (
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

        <Menu.Item position="right">
          <Image
            avatar
            spaced="right"
            src={user?.image || '/assets/user.png'}
          />

          <Dropdown
            pointing="top left"
            text={user?.displayName}
          >
            <Dropdown.Menu>
              <Dropdown.Item
                icon="user"
                text="My Profile"
                to={`/profiles/${user?.username}`}
                as={Link}
              />

              <Dropdown.Item
                icon="power"
                text="Logout"
                onClick={logout}
              />
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Item>
      </Container>
    </Menu>
  );
});

NavBar.displayName = 'NavBar';

export default NavBar;
