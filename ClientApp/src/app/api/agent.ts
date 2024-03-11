import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

import { User, UserFormValues } from '../models/user';
import { IActivity, ActivityFormValues } from '../models/activity';
import { router } from '../router/Routes';
import { store } from '../stores/store';

const sleep = (delay: number): Promise<void> => new Promise(resolve => setTimeout(resolve, delay));

axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.response.use(
  async response => {
    await sleep(1000);

    return response;
  },
  (error: AxiosError) => {
    const { data, status, config } = error.response as AxiosResponse;

    switch (status) {
      case 400:
        if (config.method === 'get' && Object.prototype.hasOwnProperty.call(data.errors, 'id')) {
          router.navigate('/not-found');
        }

        if (data.errors) {
          const modalStateErrors = [];

          for (const key in data.errors) {
            if (data.errors[key]) {
              modalStateErrors.push(data.errors[key]);
            }

            throw modalStateErrors.flat();
          }
        } else {
          toast.error(data);
        }
        break;
      case 401:
        toast.error('unauthorized');
        break;
      case 403:
        toast.error('forbidden');
        break;
      case 404:
        router.navigate('/not-found');
        break;
      case 500:
        store.commonStore.setServerError(data);
        router.navigate('/server-error');
        break;
    }

    return Promise.reject(error);
  },
);

axios.interceptors.request.use(config => {
  const token = store.commonStore.token;

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const responseBody = <T>(response: AxiosResponse<T>): T => response.data;

const req = {
  get: <T>(url: string) => axios.get<T>(url).then(responseBody),
  post: <T>(url: string, body: object) => axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: object) => axios.put<T>(url, body).then(responseBody),
  delete: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

const Activities = {
  list: () => req.get<IActivity[]>('/activities'),
  details: (id: string) => req.get<IActivity>(`/activities/${id}`),
  create: (activity: ActivityFormValues) => req.post<void>('/activities', activity),
  update: (activity: ActivityFormValues) => req.put<void>(`/activities/${activity.id}`, activity),
  delete: (id: string) => req.delete<void>(`/activities/${id}`),
  attend: (id: string) => req.post<void>(`/activities/${id}/attend`, {}),
};

const Account = {
  current: () => req.get<User>('/account'),
  login: (user: UserFormValues) => req.post<User>('/account/login', user),
  register: (user: UserFormValues) => req.post<User>('/account/register', user),
};

const agent = {
  Activities,
  Account,
};

export default agent;
