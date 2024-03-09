import { FC } from 'react';
import { ErrorMessage, Form, Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import { Button, Header, Label } from 'semantic-ui-react';

import CustomTextInput from '../../app/common/form/CustomTextInput';
import { useStore } from '../../app/stores/store';

const LoginForm: FC = () => {
  const { userStore } = useStore();

  return (
    <Formik
      initialValues={{ email: '', password: '', error: null }}
      onSubmit={(values, { setErrors }) =>
        userStore.login(values).catch(() => setErrors({ error: 'Invalid email or password' }))
      }
    >
      {({ handleSubmit, isSubmitting, errors }) => (
        <Form
          autoComplete="off"
          onSubmit={handleSubmit}
          className="ui form"
        >
          <Header
            as="h2"
            color="teal"
            textAlign="center"
            content="Login to Reactivities"
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
            render={() => (
              <Label
                basic
                color="red"
                content={errors.error}
                style={{ marginBottom: 10 }}
              />
            )}
          />

          <Button
            fluid
            positive
            type="submit"
            content="Login"
            loading={isSubmitting}
          />
        </Form>
      )}
    </Formik>
  );
};

LoginForm.displayName = 'LoginForm';

export default observer(LoginForm);
