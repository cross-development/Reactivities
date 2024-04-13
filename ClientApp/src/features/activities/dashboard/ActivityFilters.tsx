import { FC } from 'react';
import { Header, Menu } from 'semantic-ui-react';
import Calendar from 'react-calendar';
import { observer } from 'mobx-react-lite';

import { useStore } from '../../../app/stores/store';

const ActivityFilters: FC = observer(() => {
  const {
    activityStore: { predicate, setPredicate },
  } = useStore();

  return (
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

      <Menu.Item
        content="All Activities"
        active={predicate.has('all')}
        onClick={() => setPredicate('all', 'true')}
      />

      <Menu.Item
        content="I'm going"
        active={predicate.has('isGoing')}
        onClick={() => setPredicate('isGoing', 'true')}
      />

      <Menu.Item
        content="I'm hosting"
        active={predicate.has('isHost')}
        onClick={() => setPredicate('isHost', 'true')}
      />

      <Header />

      <Calendar
        value={predicate.get('startDate') || new Date()}
        onChange={date => setPredicate('startDate', date as Date)}
      />
    </Menu>
  );
});

ActivityFilters.displayName = 'ActivityFilters';

export default ActivityFilters;
