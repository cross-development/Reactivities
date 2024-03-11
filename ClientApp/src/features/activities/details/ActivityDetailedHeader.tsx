import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { Header, Segment, Image, Item, Button, Label } from 'semantic-ui-react';
import { format } from 'date-fns';

import { IActivity } from '../../../app/models/activity';
import { useStore } from '../../../app/stores/store';

interface Props {
  activity: IActivity;
}

const ActivityDetailedHeader: FC<Props> = observer(({ activity }) => {
  const {
    activityStore: { updateAttendance, cancelActivityToggle, isLoading },
  } = useStore();

  return (
    <Segment.Group>
      <Segment
        basic
        attached="top"
        style={{ padding: '0' }}
      >
        {activity.isCanceled && (
          <Label
            ribbon
            color="red"
            content="Canceled"
            style={{ position: 'absolute', zIndex: 1000, left: -14, top: 20 }}
          />
        )}

        <Image
          fluid
          src={`/assets/categoryImages/${activity.category}.jpg`}
          style={{ filter: 'brightness(30%)' }}
        />

        <Segment
          basic
          style={{
            position: 'absolute',
            bottom: '5%',
            left: '5%',
            width: '100%',
            height: 'auto',
            color: 'white',
          }}
        >
          <Item.Group>
            <Item>
              <Item.Content>
                <Header
                  size="huge"
                  content={activity.title}
                  style={{ color: 'white' }}
                />

                <p>{format(activity.date!, 'dd MMM yyyy')}</p>

                <p>
                  Hosted by{' '}
                  <strong>
                    <Link to={`/profiles/${activity.host?.username}`}>
                      {activity.host?.displayName}
                    </Link>
                  </strong>
                </p>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment>

      <Segment
        clearing
        attached="bottom"
      >
        {activity.isHost ? (
          <>
            <Button
              basic
              floated="left"
              loading={isLoading}
              color={activity.isCanceled ? 'green' : 'red'}
              content={activity.isCanceled ? 'Re-activate Activity' : 'Cancel Activity'}
              onClick={cancelActivityToggle}
            />

            <Button
              color="orange"
              floated="right"
              as={Link}
              to={`/manage/${activity.id}`}
              disabled={activity.isCanceled}
            >
              Manage Event
            </Button>
          </>
        ) : activity.isGoing ? (
          <Button
            loading={isLoading}
            onClick={updateAttendance}
          >
            Cancel attendance
          </Button>
        ) : (
          <Button
            color="teal"
            loading={isLoading}
            disabled={activity.isCanceled}
            onClick={updateAttendance}
          >
            Join Activity
          </Button>
        )}
      </Segment>
    </Segment.Group>
  );
});

ActivityDetailedHeader.displayName = 'ActivityDetailedHeader';

export default ActivityDetailedHeader;
