import { memo, useState } from 'react';
import axios from 'axios';
import { Button, Header, Segment } from 'semantic-ui-react';

import ValidationError from './ValidationError';

const TestError = memo(() => {
  const [errors, setErrors] = useState(null);

  const handleNotFound = (): void => {
    axios.get('/buggy/not-found').catch(err => console.log(err.response));
  };

  const handleBadRequest = (): void => {
    axios.get('/buggy/bad-request').catch(err => console.log(err.response));
  };

  const handleServerError = (): void => {
    axios.get('/buggy/server-error').catch(err => console.log(err.response));
  };

  const handleUnauthorised = (): void => {
    axios.get('/buggy/unauthorised').catch(err => console.log(err.response));
  };

  const handleBadGuid = (): void => {
    axios.get('/activities/notaguid').catch(err => console.log(err.response));
  };

  const handleValidationError = (): void => {
    axios.post('/activities', {}).catch(err => setErrors(err));
  };

  return (
    <>
      <Header
        as="h1"
        content="Test Error component"
      />

      <Segment>
        <Button.Group widths="7">
          <Button
            basic
            primary
            content="Not Found"
            onClick={handleNotFound}
          />

          <Button
            basic
            primary
            content="Bad Request"
            onClick={handleBadRequest}
          />

          <Button
            basic
            primary
            content="Validation Error"
            onClick={handleValidationError}
          />

          <Button
            basic
            primary
            content="Server Error"
            onClick={handleServerError}
          />

          <Button
            basic
            primary
            content="Unauthorised"
            onClick={handleUnauthorised}
          />

          <Button
            basic
            primary
            content="Bad Guid"
            onClick={handleBadGuid}
          />
        </Button.Group>
      </Segment>

      {errors && <ValidationError errors={errors} />}
    </>
  );
});

TestError.displayName = 'TestError';

export default TestError;
