import { useEffect, useState } from 'react';
import { Header, List } from 'semantic-ui-react';
import axios from 'axios';
import { IActivity } from './types/activity';

const App = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/activities').then(res => {
      setActivities(res.data);
    });
  }, []);

  return (
    <div>
      <Header
        as="h2"
        icon="users"
        content="Reactivities"
      />

      <List>
        {activities.map(activity => (
          <List.Item key={activity.id}>{activity.title}</List.Item>
        ))}
      </List>
    </div>
  );
};

export default App;
