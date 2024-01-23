import { RouteObject, createBrowserRouter } from 'react-router-dom';

import App from '../layout/App';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
      { path: 'activities', element: <ActivityDashboard /> },
      { path: 'activities/:id', element: <ActivityDetails /> },
      { path: 'create-activity', element: <ActivityForm key="create" /> },
      { path: 'manage/:id', element: <ActivityForm key="manage" /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
