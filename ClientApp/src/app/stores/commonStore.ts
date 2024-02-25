import { makeAutoObservable } from 'mobx';

import { ServerError } from '../models/error';

class CommonStore {
  public error: ServerError | null;

  constructor() {
    makeAutoObservable(this);
  }

  public setServerError(error: ServerError): void {
    this.error = error;
  }
}

export default CommonStore;
