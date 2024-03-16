import { FC, memo } from 'react';
import { Header, Menu } from 'semantic-ui-react';
import Calendar from 'react-calendar';

const ActivityFilters: FC = memo(() => (
  <Menu
    vertical
    size="large"
    style={{ width: '100%', marginTop: 25 }}
  >
    <Header
      attached
      icon="filter"
      color="teal"
      content="Filters"
    />

    <Menu.Item content="All Activities" />

    <Menu.Item content="I'm going" />

    <Menu.Item content="I'm hosting" />

    <Header />

    <Calendar />
  </Menu>
));

ActivityFilters.displayName = 'ActivityFilters';

export default ActivityFilters;
