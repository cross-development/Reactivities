import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import {
  requestFulfilledInterceptor,
  responseFulfilledInterceptor,
  responseRejectedInterceptor,
} from './interceptors';
import { IPhoto, IProfile } from '../models/profile';
import { User, UserActivity, UserFormValues } from '../models/user';
import { IActivity, ActivityFormValues } from '../models/activity';
import { PaginatedResult } from '../models/pagination';

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

axios.interceptors.response.use(responseFulfilledInterceptor, responseRejectedInterceptor);
axios.interceptors.request.use(requestFulfilledInterceptor);

const responseBody = <T>(response: AxiosResponse<T>): T => response.data;

const req = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    axios.get<T>(url, config).then(responseBody),
  post: <T>(url: string, body: object) => axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: object) => axios.put<T>(url, body).then(responseBody),
  delete: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

const Activities = {
  list: (params: URLSearchParams) =>
    req.get<PaginatedResult<IActivity[]>>('/activities', { params }),
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
  fbLogin: (accessToken: string) =>
    req.post<User>(`/account/fb-login?accessToken=${accessToken}`, {}),
  refreshToken: () => req.post<User>('/account/refresh-token', {}),
};

const Profile = {
  get: (username: string) => req.get<IProfile>(`/profiles/${username}`),
  uploadPhoto: (file: Blob) => {
    const formData = new FormData();
    formData.append('File', file);

    return axios.post<IPhoto>('/photos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  setMainPhoto: (id: string) => req.post(`/photos/${id}/set-main`, {}),
  deletePhoto: (id: string) => req.delete(`/photos/${id}`),
  updateProfile: (profile: Partial<IProfile>) => req.put('/profiles', profile),
  updateFollowing: (username: string) => req.post(`/follow/${username}`, {}),
  listFollowings: (username: string, predicate: string) =>
    req.get<IProfile[]>(`/follow/${username}?predicate=${predicate}`),
  listActivities: (username: string, predicate: string) =>
    req.get<UserActivity[]>(`/profiles/${username}/activities?predicate=${predicate}`),
};

const agent = {
  Activities,
  Account,
  Profile,
};

export default agent;
