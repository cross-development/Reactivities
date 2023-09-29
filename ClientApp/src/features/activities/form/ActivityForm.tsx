import { FC, useState, ChangeEvent } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Form, Segment } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';
import { useStore } from '../../../app/stores/store';

const ActivityForm: FC = () => {
  const { activityStore } = useStore();

  const { selectedActivity, closeForm, createActivity, updateActivity, isLoading } = activityStore;

  const initialState = selectedActivity ?? {
    id: '',
    title: '',
    category: '',
    description: '',
    date: '',
    city: '',
    venue: '',
  };

  const [activity, setActivity] = useState<Activity>(initialState);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;

    setActivity(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (): void => {
    activity.id ? updateActivity(activity) : createActivity(activity);
  };

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
          onClick={closeForm}
        />
      </Form>
    </Segment>
  );
};

ActivityForm.displayName = 'ActivityForm';

export default observer(ActivityForm);
