import { FC } from 'react';
import { Tab } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';

import ProfilePhotos from './ProfilePhotos';
import { IProfile } from '../../app/models/profile';

interface Props {
  profile: IProfile;
}

const ProfileContent: FC<Props> = observer(({ profile }) => {
  const panes = [
    { menuItem: 'About', render: () => <Tab.Pane>About Content</Tab.Pane> },
    { menuItem: 'Photos', render: () => <ProfilePhotos profile={profile} /> },
    { menuItem: 'Events', render: () => <Tab.Pane>Events Content</Tab.Pane> },
    { menuItem: 'Followers', render: () => <Tab.Pane>Followers Content</Tab.Pane> },
    { menuItem: 'Following', render: () => <Tab.Pane>Following Content</Tab.Pane> },
  ];

  return (
    <Tab
      menu={{ flued: true, vertical: true }}
      menuPosition="right"
      panes={panes}
    />
  );
});

ProfileContent.displayName = 'ProfileContent';

export default ProfileContent;
