import { FC, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { Segment, Header, Comment, Loader } from 'semantic-ui-react';
import { Formik, Form, Field, FieldProps } from 'formik';
import { formatDistanceToNow } from 'date-fns';
import * as Yup from 'yup';

import { useStore } from '../../../app/stores/store';

interface Props {
  activityId: string;
}

const ActivityDetailedChat: FC<Props> = observer(({ activityId }) => {
  const { commentStore } = useStore();

  useEffect(() => {
    if (activityId) {
      commentStore.createHubConnection(activityId);
    }

    return () => {
      commentStore.clearComments();
    };
  }, [activityId, commentStore]);

  return (
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

      <Segment
        attached
        clearing
      >
        <Formik
          initialValues={{ body: '' }}
          validationSchema={Yup.object({ body: Yup.string().required() })}
          onSubmit={(values, { resetForm }) =>
            commentStore.addComment(values).then(() => resetForm())
          }
        >
          {({ isSubmitting, isValid, handleSubmit }) => (
            <Form className="ui form">
              <Field name="body">
                {(props: FieldProps) => (
                  <div style={{ position: 'relative' }}>
                    <Loader active={isSubmitting} />

                    <textarea
                      rows={2}
                      placeholder="Enter your comment (Enter to submit, SHIFT + Enter for new line)"
                      {...props.field}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && e.shiftKey) {
                          return;
                        }

                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();

                          isValid && handleSubmit();
                        }
                      }}
                    />
                  </div>
                )}
              </Field>
            </Form>
          )}
        </Formik>

        <Comment.Group>
          {commentStore.comments.map(comment => (
            <Comment key={comment.id}>
              <Comment.Avatar src={comment.image || '/assets/user.png'} />

              <Comment.Content>
                <Comment.Author
                  as={Link}
                  to={`/profiles/${comment.username}`}
                >
                  {comment.displayName}
                </Comment.Author>

                <Comment.Metadata>
                  <div>{formatDistanceToNow(comment.createdAt)} ago</div>
                </Comment.Metadata>

                <Comment.Text style={{ whiteSpace: 'pre-wrap' }}>{comment.body}</Comment.Text>
              </Comment.Content>
            </Comment>
          ))}
        </Comment.Group>
      </Segment>
    </>
  );
});

ActivityDetailedChat.displayName = 'ActivityDetailedChat';

export default ActivityDetailedChat;
