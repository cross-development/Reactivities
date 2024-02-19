import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { Segment, Header, Comment, Form, Button } from 'semantic-ui-react';

const ActivityDetailedChat: FC = observer(() => (
  <>
    <Segment
      inverted
      color="teal"
      attached="top"
      textAlign="center"
      style={{ border: 'none' }}
    >
      <Header>Chat about this event</Header>
    </Segment>

    <Segment attached>
      <Comment.Group>
        <Comment>
          <Comment.Avatar src="/assets/user.png" />
          <Comment.Content>
            <Comment.Author as="a">Matt</Comment.Author>

            <Comment.Metadata>
              <div>Today at 5:42PM</div>
            </Comment.Metadata>

            <Comment.Text>How artistic!</Comment.Text>

            <Comment.Actions>
              <Comment.Action>Reply</Comment.Action>
            </Comment.Actions>
          </Comment.Content>
        </Comment>

        <Comment>
          <Comment.Avatar src="/assets/user.png" />
          <Comment.Content>
            <Comment.Author as="a">Joe Henderson</Comment.Author>

            <Comment.Metadata>
              <div>5 days ago</div>
            </Comment.Metadata>

            <Comment.Text>Dude, this is awesome. Thanks so much</Comment.Text>

            <Comment.Actions>
              <Comment.Action>Reply</Comment.Action>
            </Comment.Actions>
          </Comment.Content>
        </Comment>

        <Form reply>
          <Form.TextArea />

          <Button
            primary
            icon="edit"
            content="Add Reply"
            labelPosition="left"
          />
        </Form>
      </Comment.Group>
    </Segment>
  </>
));

ActivityDetailedChat.displayName = 'ActivityDetailedChat';

export default ActivityDetailedChat;
