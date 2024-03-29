import { makeAutoObservable, runInAction } from 'mobx';

import { User, UserFormValues } from '../models/user';
import agent from '../api/agent';
import { store } from './store';
import { router } from '../router/Routes';

class UserStore {
  public user: User | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get isLoggedIn(): boolean {
    return !!this.user;
  }

  public register = async (credentials: UserFormValues): Promise<void> => {
    try {
      const user = await agent.Account.register(credentials);
      store.commonStore.setToken(user.token);

      runInAction(() => {
        this.user = user;
      });

      router.navigate('/activities');

      store.modalStore.closeModal();
    } catch (error) {
      console.log('error', error);

      throw error;
    }
  };

  public login = async (credentials: UserFormValues): Promise<void> => {
    try {
      const user = await agent.Account.login(credentials);
      store.commonStore.setToken(user.token);

      runInAction(() => {
        this.user = user;
      });

      router.navigate('/activities');

      store.modalStore.closeModal();
    } catch (error) {
      console.log('error', error);

      throw error;
    }
  };

  public logout = (): void => {
    store.commonStore.setToken(null);

    this.user = null;

    router.navigate('/');
  };

  public getUser = async (): Promise<void> => {
    try {
      const user = await agent.Account.current();

      runInAction(() => {
        this.user = user;
      });
    } catch (error) {
      console.log('error', error);
    }
  };

  public setImage = (image: string): void => {
    if (this.user) {
      this.user.image = image;
    }
  };
}

export default UserStore;
