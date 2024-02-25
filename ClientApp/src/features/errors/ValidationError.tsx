import { FC, memo } from 'react';
import { Message } from 'semantic-ui-react';

interface Props {
  errors: string[];
}

const ValidationError: FC<Props> = memo(({ errors }) => (
  <Message error>
    {errors && (
      <Message.List>
        {errors.map((error, index) => (
          <Message.Item key={index}>{error}</Message.Item>
        ))}
      </Message.List>
    )}
  </Message>
));

ValidationError.displayName = 'ValidationError';

export default ValidationError;
