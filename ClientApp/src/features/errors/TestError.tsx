import { memo } from 'react';
import axios from 'axios';
import { Button, Header, Segment } from 'semantic-ui-react';

const TestError = memo(() => {
  const baseUrl = 'http://localhost:5000/api/';

  const handleNotFound = () => {
    axios.get(baseUrl + 'buggy/not-found').catch(err => console.log(err.response));
  };

  const handleBadRequest = () => {
    axios.get(baseUrl + 'buggy/bad-request').catch(err => console.log(err.response));
  };

  const handleServerError = () => {
    axios.get(baseUrl + 'buggy/server-error').catch(err => console.log(err.response));
  };

  const handleUnauthorised = () => {
    axios.get(baseUrl + 'buggy/unauthorised').catch(err => console.log(err.response));
  };

  const handleBadGuid = () => {
    axios.get(baseUrl + 'activities/notaguid').catch(err => console.log(err.response));
  };

  const handleValidationError = () => {
    axios.post(baseUrl + 'activities', {}).catch(err => console.log(err.response));
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
    </>
  );
});

TestError.displayName = 'TestError';

export default TestError;
