import { makeAutoObservable, runInAction } from 'mobx';

import { User, UserFormValues } from '../models/user';
import agent from '../api/agent';
import { store } from './store';
import { router } from '../router/Routes';

class UserStore {
  public user: User | null = null;
  public fbLoading: boolean = false;
  public refreshTokenTimeout?: number;

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
      this.startRefreshTokenTimer(user);

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
      this.startRefreshTokenTimer(user);

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

      store.commonStore.setToken(user.token);
      this.startRefreshTokenTimer(user);

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

  public setDisplayName = (name: string): void => {
    if (this.user) {
      this.user.displayName = name;
    }
  };

  public facebookLogin = async (accessToken: string): Promise<void> => {
    try {
      this.fbLoading = true;

      const user = await agent.Account.fbLogin(accessToken);

      store.commonStore.setToken(user.token);
      this.startRefreshTokenTimer(user);

      runInAction(() => {
        this.user = user;
      });

      router.navigate('/activities');
    } catch (error) {
      console.log('error', error);
    } finally {
      runInAction(() => {
        this.fbLoading = false;
      });
    }
  };

  public refreshToken = async (): Promise<void> => {
    this.stopRefreshTokenTimer();

    try {
      const user = await agent.Account.refreshToken();

      store.commonStore.setToken(user.token);
      this.startRefreshTokenTimer(user);

      runInAction(() => {
        this.user = user;
      });
    } catch (error) {
      console.log('error', error);
    }
  };

  private startRefreshTokenTimer = (user: User): void => {
    const jwtToken = JSON.parse(atob(user.token.split('.')[1]));
    const expires = new Date(jwtToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - 30 * 1000;

    this.refreshTokenTimeout = setTimeout(this.refreshToken, timeout);
  };

  private stopRefreshTokenTimer = (): void => {
    clearTimeout(this.refreshTokenTimeout);
  };
}

export default UserStore;
