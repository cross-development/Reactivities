import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';

import { router } from '../router/Routes';
import { store } from '../stores/store';

const sleep = (delay: number): Promise<void> => new Promise(resolve => setTimeout(resolve, delay));

export const responseFulfilledInterceptor = async (response: AxiosResponse<unknown, unknown>) => {
  await sleep(1000);

  return response;
};

export const responseRejectedInterceptor = async (error: AxiosError) => {
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
};

export const requestFulfilledInterceptor = async (request: InternalAxiosRequestConfig<unknown>) => {
  const token = store.commonStore.token;

  if (token && request.headers) {
    request.headers.Authorization = `Bearer ${token}`;
  }

  return request;
};
