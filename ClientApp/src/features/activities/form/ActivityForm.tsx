import { FC, useState, ChangeEvent, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Form, Segment } from 'semantic-ui-react';
import { v4 as uuid } from 'uuid';

import { Activity } from '../../../app/models/activity';
import { useStore } from '../../../app/stores/store';
import Loader from '../../../app/layout/Loader';

const ActivityForm: FC = () => {
  const [activity, setActivity] = useState<Activity>({
    id: '',
    title: '',
    category: '',
    description: '',
    date: '',
    city: '',
    venue: '',
  });

  const { id } = useParams();

  const navigate = useNavigate();

  const {
    activityStore: { isLoading, isInitialLoading, loadActivity, updateActivity, createActivity },
  } = useStore();

  useEffect(() => {
    if (id) {
      loadActivity(id).then(activity => setActivity(activity!));
    }
  }, [id, loadActivity]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;

    setActivity(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (): Promise<void> => {
    if (!activity.id) {
      activity.id = uuid();
      await createActivity(activity);
    } else {
      await updateActivity(activity);
    }

    navigate(`/activities/${activity.id}`);
  };

  if (isInitialLoading) {
    return <Loader content="Loading activity..." />;
  }

  return (
    <Segment clearing>
      <Form
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <Form.Input
          name="title"
          placeholder="Title"
          value={activity.title}
          onChange={handleInputChange}
        />

        <Form.TextArea
          name="description"
          placeholder="Description"
          value={activity.description}
          onChange={handleInputChange}
        />

        <Form.Input
          name="category"
          placeholder="Category"
          value={activity.category}
          onChange={handleInputChange}
        />

        <Form.Input
          name="date"
          type="date"
          placeholder="Date"
          value={activity.date}
          onChange={handleInputChange}
        />

        <Form.Input
          name="city"
          placeholder="City"
          value={activity.city}
          onChange={handleInputChange}
        />

        <Form.Input
          name="venue"
          placeholder="Venue"
          value={activity.venue}
          onChange={handleInputChange}
        />

        <Button
          positive
          type="submit"
          floated="right"
          content="Submit"
          loading={isLoading}
        />

        <Button
          type="button"
          floated="right"
          content="Cancel"
          to="/activities"
          as={Link}
        />
      </Form>
    </Segment>
  );
};

ActivityForm.displayName = 'ActivityForm';

export default observer(ActivityForm);
