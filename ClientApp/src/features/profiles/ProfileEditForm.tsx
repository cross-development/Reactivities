import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { Button } from 'semantic-ui-react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

import { useStore } from '../../app/stores/store';
import CustomTextInput from '../../app/common/form/CustomTextInput';
import CustomTextArea from '../../app/common/form/CustomTextArea';

interface Props {
  setEditMode: (editMode: boolean) => void;
}

const ProfileEditForm: FC<Props> = observer(({ setEditMode }) => {
  const {
    profileStore: { profile, updateProfile },
  } = useStore();

  return (
    <Formik
      initialValues={{ displayName: profile?.displayName, bio: profile?.bio }}
      onSubmit={values => updateProfile(values).then(() => setEditMode(false))}
      validationSchema={Yup.object({ displayName: Yup.string().required() })}
    >
      {({ isSubmitting, isValid, dirty }) => (
        <Form className="ui form">
          <CustomTextInput
            name="displayName"
            placeholder="Display Name"
          />

          <CustomTextArea
            rows={3}
            name="bio"
            placeholder="Add your bio"
          />

          <Button
            positive
            type="submit"
            floated="right"
            content="Update profile"
            loading={isSubmitting}
            disabled={!isValid || !dirty}
          />
        </Form>
      )}
    </Formik>
  );
});

ProfileEditForm.displayName = 'ProfileEditForm';

export default ProfileEditForm;
