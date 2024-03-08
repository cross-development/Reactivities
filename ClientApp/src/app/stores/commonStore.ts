import { makeAutoObservable, reaction } from 'mobx';

import { ServerError } from '../models/error';

class CommonStore {
  public error: ServerError | null;
  public appLoaded: boolean = false;
  public token: string | null | undefined = localStorage.getItem('jwt');

  constructor() {
    makeAutoObservable(this);

    reaction(
      () => this.token,
      token => {
        if (token) {
          localStorage.setItem('jwt', token);
        } else {
          localStorage.removeItem('jwt');
        }
      },
    );
  }

  public setServerError = (error: ServerError): void => {
    this.error = error;
  };

  public setToken = (token: string | null): void => {
    this.token = token;
  };

  public setAppLoaded = (): void => {
    this.appLoaded = true;
  };
}

export default CommonStore;
