import { makeAutoObservable, reaction, runInAction } from 'mobx';

import { IPhoto, IProfile } from '../models/profile';
import agent from '../api/agent';
import { store } from './store';

class ProfileStore {
  public profile: IProfile | null = null;
  public loadingProfile: boolean = false;
  public uploading: boolean = false;
  public loading: boolean = false;
  public followings: IProfile[] = [];
  public loadingFollowings: boolean = false;
  public activeTab: number = 0;

  constructor() {
    makeAutoObservable(this);

    reaction(
      () => this.activeTab,
      activeTab => {
        if (activeTab === 3 || activeTab === 4) {
          const predicate = activeTab === 3 ? 'followers' : 'following';

          this.loadFollowings(predicate);
        } else {
          this.followings = [];
        }
      },
    );
  }

  public get isCurrentUser(): boolean {
    if (store.userStore.user && this.profile) {
      return store.userStore.user.username === this.profile.username;
    }

    return false;
  }

  public setActiveTab = (activeTab: number): void => {
    this.activeTab = activeTab;
  };

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

  public updateFollowing = async (username: string, following: boolean): Promise<void> => {
    this.loading = true;

    try {
      await agent.Profile.updateFollowing(username);

      store.activityStore.updateAttendeeFollowing(username);

      runInAction(() => {
        if (
          this.profile &&
          this.profile.username !== store.userStore.user?.username &&
          this.profile.username === username
        ) {
          following ? this.profile.followersCount++ : this.profile.followersCount--;
          this.profile.following = !this.profile.following;
        }

        if (this.profile && this.profile.username === store.userStore.user?.username) {
          following ? this.profile.followingCount++ : this.profile.followingCount--;
        }

        this.followings.forEach(profile => {
          if (profile.username === username) {
            profile.following ? profile.followersCount-- : profile.followersCount++;
            profile.following = !profile.following;
          }
        });
      });
    } catch (error) {
      console.log('error', error);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  public loadFollowings = async (predicate: string): Promise<void> => {
    this.loadingFollowings = true;

    try {
      const followings = await agent.Profile.listFollowings(this.profile!.username, predicate);

      runInAction(() => {
        this.followings = followings;
      });
    } catch (error) {
      console.log('error', error);
    } finally {
      runInAction(() => {
        this.loadingFollowings = false;
      });
    }
  };
}

export default ProfileStore;
