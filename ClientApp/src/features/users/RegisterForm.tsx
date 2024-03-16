import { FC } from 'react';
import { ErrorMessage, Form, Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import { Button, Header } from 'semantic-ui-react';
import * as Yup from 'yup';

import CustomTextInput from '../../app/common/form/CustomTextInput';
import { useStore } from '../../app/stores/store';
import ValidationError from '../errors/ValidationError';

const RegisterForm: FC = observer(() => {
  const { userStore } = useStore();

  const validationSchema = Yup.object({
    displayName: Yup.string().required(),
    username: Yup.string().required(),
    email: Yup.string().email().required(),
    password: Yup.string().required('Date is required').nullable(),
  });

  return (
    <Formik
      initialValues={{ displayName: '', username: '', email: '', password: '', error: null }}
      validationSchema={validationSchema}
      onSubmit={(values, { setErrors }) =>
        userStore.register(values).catch(error => setErrors({ error }))
      }
    >
      {({ handleSubmit, isSubmitting, isValid, dirty, errors }) => (
        <Form
          autoComplete="off"
          onSubmit={handleSubmit}
          className="ui form error"
        >
          <Header
            as="h2"
            color="teal"
            textAlign="center"
            content="Sign up to Reactivities"
          />

          <CustomTextInput
            name="displayName"
            placeholder="Display Name"
          />

          <CustomTextInput
            name="username"
            placeholder="Username"
          />

          <CustomTextInput
            type="email"
            name="email"
            placeholder="Email"
          />

          <CustomTextInput
            type="password"
            name="password"
            placeholder="Password"
          />

          <ErrorMessage
            name="error"
            render={() => <ValidationError errors={errors.error as unknown as string[]} />}
          />

          <Button
            fluid
            positive
            type="submit"
            content="Register"
            disabled={!isValid || !dirty || isSubmitting}
            loading={isSubmitting}
          />
        </Form>
      )}
    </Formik>
  );
});

RegisterForm.displayName = 'RegisterForm';

export default RegisterForm;
