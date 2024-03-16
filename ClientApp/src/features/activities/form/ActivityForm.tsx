import { FC, useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Header, Segment } from 'semantic-ui-react';
import { Formik, Form } from 'formik';
import { v4 as uuid } from 'uuid';
import * as Yup from 'yup';

import { ActivityFormValues } from '../../../app/models/activity';
import { useStore } from '../../../app/stores/store';
import Loader from '../../../app/layout/Loader';
import CustomTextInput from '../../../app/common/form/CustomTextInput';
import CustomTextArea from '../../../app/common/form/CustomTextArea';
import CustomSelectInput from '../../../app/common/form/CustomSelectInput';
import CustomDateInput from '../../../app/common/form/CustomDateInput';
import { categoryOptions } from '../../../app/common/options/categoryOptions';

const ActivityForm: FC = observer(() => {
  const [activity, setActivity] = useState<ActivityFormValues>(new ActivityFormValues());

  const { id } = useParams();

  const navigate = useNavigate();

  const validationSchema = Yup.object({
    title: Yup.string().required('The activity title is required'),
    description: Yup.string().required('The activity description is required'),
    category: Yup.string().required(),
    date: Yup.string().required('Date is required').nullable(),
    venue: Yup.string().required(),
    city: Yup.string().required(),
  });

  const {
    activityStore: { isInitialLoading, loadActivity, updateActivity, createActivity },
  } = useStore();

  useEffect(() => {
    if (id) {
      loadActivity(id).then(activity => setActivity(new ActivityFormValues(activity)));
    }
  }, [id, loadActivity]);

  const handleFormSubmit = async (activity: ActivityFormValues): Promise<void> => {
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
      <Header
        sub
        color="teal"
        content="Activity Details"
      />

      <Formik
        enableReinitialize
        initialValues={activity}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
      >
        {({ handleSubmit, isValid, isSubmitting, dirty }) => (
          <Form
            autoComplete="off"
            onSubmit={handleSubmit}
            className="ui form"
          >
            <CustomTextInput
              name="title"
              placeholder="Title"
            />

            <CustomTextInput
              name="title"
              placeholder="Title"
            />

            <CustomTextArea
              rows={3}
              name="description"
              placeholder="Description"
            />

            <CustomSelectInput
              name="category"
              placeholder="Category"
              options={categoryOptions}
            />

            <CustomDateInput
              showTimeSelect
              name="date"
              timeCaption="time"
              placeholderText="Date"
              dateFormat="MMM d, yyyy h:mm aa"
            />

            <Header
              sub
              color="teal"
              content="Location Details"
            />

            <CustomTextInput
              name="city"
              placeholder="City"
            />

            <CustomTextInput
              name="venue"
              placeholder="Venue"
            />

            <Button
              positive
              type="submit"
              floated="right"
              content="Submit"
              loading={isSubmitting}
              disabled={isSubmitting || !dirty || !isValid}
            />

            <Button
              type="button"
              floated="right"
              content="Cancel"
              to="/activities"
              as={Link}
            />
          </Form>
        )}
      </Formik>
    </Segment>
  );
});

ActivityForm.displayName = 'ActivityForm';

export default ActivityForm;
