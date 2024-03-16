import { makeAutoObservable, runInAction } from 'mobx';

import { IPhoto, IProfile } from '../models/profile';
import agent from '../api/agent';
import { store } from './store';

class ProfileStore {
  public profile: IProfile | null = null;
  public loadingProfile: boolean = false;
  public uploading: boolean = false;
  public loading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  public get isCurrentUser(): boolean {
    if (store.userStore.user && this.profile) {
      return store.userStore.user.username === this.profile.username;
    }

    return false;
  }

  public loadProfile = async (username: string): Promise<void> => {
    this.loadingProfile = true;

    try {
      const profile = await agent.Profile.get(username);

      runInAction(() => {
        this.profile = profile;
      });
    } catch (error) {
      console.log('error', error);
    } finally {
      runInAction(() => {
        this.loadingProfile = false;
      });
    }
  };

  public uploadPhoto = async (file: Blob): Promise<void> => {
    this.uploading = true;

    try {
      const response = await agent.Profile.uploadPhoto(file);
      const photo = response.data;

      runInAction(() => {
        if (this.profile) {
          this.profile.photos?.push(photo);

          if (photo.isMain && store.userStore.user) {
            store.userStore.setImage(photo.url);
            this.profile.image = photo.url;
          }
        }
      });
    } catch (error) {
      console.log('error', error);
    } finally {
      runInAction(() => {
        this.uploading = false;
      });
    }
  };

  public setMainPhoto = async (photo: IPhoto): Promise<void> => {
    this.loading = true;

    try {
      await agent.Profile.setMainPhoto(photo.id);

      store.userStore.setImage(photo.url);

      runInAction(() => {
        if (this.profile && this.profile.photos) {
          this.profile.photos.find(p => p.isMain)!.isMain = false;
          this.profile.photos.find(p => p.id === photo.id)!.isMain = true;
          this.profile.image = photo.url;
        }
      });
    } catch (error) {
      console.log('error', error);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  public deletePhoto = async (photo: IPhoto): Promise<void> => {
    this.loading = true;

    try {
      await agent.Profile.deletePhoto(photo.id);

      runInAction(() => {
        if (this.profile) {
          this.profile.photos = this.profile.photos?.filter(p => p.id !== photo.id);
        }
      });
    } catch (error) {
      console.log('error', error);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };
}

export default ProfileStore;
