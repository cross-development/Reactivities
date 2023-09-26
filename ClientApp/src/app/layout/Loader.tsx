import { FC, memo } from 'react';
import { Dimmer, Loader as LoadingComponent } from 'semantic-ui-react';

interface Props {
  inverted?: boolean;
  content?: string;
}

const Loader: FC<Props> = memo(({ content = 'Loading...', inverted = true }) => (
  <Dimmer
    active
    inverted={inverted}
  >
    <LoadingComponent content={content} />
  </Dimmer>
));

Loader.displayName = 'Loader';

export default Loader;
