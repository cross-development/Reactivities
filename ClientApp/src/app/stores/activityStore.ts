import { makeAutoObservable, reaction, runInAction } from 'mobx';
import { format } from 'date-fns';

import agent from '../api/agent';
import { store } from './store';
import { Activity, ActivityFormValues } from '../models/activity';
import { Profile } from '../models/profile';
import { Pagination, PagingParams } from '../models/pagination';

class ActivityStore {
  public activityRegistry = new Map<string, Activity>();
  public selectedActivity: Activity | undefined = undefined;
  public isEditMode = false;
  public isLoading = false;
  public isInitialLoading = false;
  public pagination: Pagination | null = null;
  public pagingParams: PagingParams = new PagingParams();
  public predicate = new Map().set('all', true);

  constructor() {
    makeAutoObservable(this);

    reaction(
      () => this.predicate.keys(),
      () => {
        this.pagingParams = new PagingParams();
        this.activityRegistry.clear();
        this.loadActivities();
      },
    );
  }

  get activitiesByDate(): Activity[] {
    return Array.from(this.activityRegistry.values()).sort(
      (a, b) => a.date!.getTime() - b.date!.getTime(),
    );
  }

  get groupedActivities(): [string, Activity[]][] {
    return Object.entries(
      this.activitiesByDate.reduce((activities, activity) => {
        const date = format(activity.date!, 'dd MMM yyyy');
        activities[date] = activities[date] ? [...activities[date], activity] : [activity];

        return activities;
      }, {} as Record<string, Activity[]>),
    );
  }

  get axiosParams(): URLSearchParams {
    const params = new URLSearchParams();

    params.append('pageNumber', this.pagingParams.pageNumber.toString());
    params.append('pageSize', this.pagingParams.pageSize.toString());

    this.predicate.forEach((value, key) => {
      if (key === 'startDate') {
        params.append(key, (value as Date).toISOString());
      } else {
        params.append(key, value);
      }
    });

    return params;
  }

  public setPredicate = (predicate: string, value: string | Date): void => {
    const resetPredicate = (): void => {
      this.predicate.forEach((_, key) => {
        if (key !== 'startDate') {
          this.predicate.delete(key);
        }
      });
    };

    switch (predicate) {
      case 'all':
        resetPredicate();
        this.predicate.set('all', true);
        break;

      case 'isGoing':
        resetPredicate();
        this.predicate.set('isGoing', true);
        break;

      case 'isHost':
        resetPredicate();
        this.predicate.set('isHost', true);
        break;

      case 'startDate':
        this.predicate.delete('startDate');
        this.predicate.set('startDate', value);
        break;
    }
  };

  public setPagingParams = (pagingParams: PagingParams): void => {
    this.pagingParams = pagingParams;
  };

  public loadActivities = async (): Promise<void> => {
    this.isInitialLoading = true;

    try {
      const result = await agent.Activities.list(this.axiosParams);

      result.data.forEach(this.setActivity);

      this.setPagination(result.pagination);
    } catch (error) {
      console.log('error', error);
    } finally {
      runInAction(() => {
        this.isInitialLoading = false;
      });
    }
  };

  public setPagination = (pagination: Pagination): void => {
    this.pagination = pagination;
  };

  public loadActivity = async (id: string): Promise<Activity | undefined> => {
    let activity = this.getActivity(id);

    if (activity) {
      this.selectedActivity = activity;
      return activity;
    } else {
      this.isInitialLoading = true;

      try {
        activity = await agent.Activities.details(id);

        this.setActivity(activity);

        runInAction(() => {
          this.selectedActivity = activity;
        });

        return activity;
      } catch (error) {
        console.log('error', error);
      } finally {
        runInAction(() => {
          this.isInitialLoading = false;
        });
      }
    }
  };

  private setActivity = (activity: Activity): void => {
    const user = store.userStore.user;

    if (user) {
      activity.isGoing = activity.attendees.some(a => a.username === user.username);
      activity.isHost = activity.hostUsername === user.username;
      activity.host = activity.attendees.find(a => a.username === activity.hostUsername);
    }

    this.activityRegistry.set(activity.id, { ...activity, date: new Date(activity.date!) });
  };

  private getActivity = (id: string): Activity | undefined => {
    return this.activityRegistry.get(id);
  };

  public createActivity = async (activity: ActivityFormValues): Promise<void> => {
    const user = store.userStore.user;
    const attendee = new Profile(user!);

    try {
      await agent.Activities.create(activity);

      const newActivity = new Activity(activity);
      newActivity.hostUsername = user!.username;
      newActivity.attendees = [attendee];

      this.setActivity(newActivity);

      runInAction(() => {
        this.selectedActivity = newActivity;
      });
    } catch (error) {
      console.log('error', error);
    }
  };

  public updateActivity = async (activity: ActivityFormValues): Promise<void> => {
    try {
      await agent.Activities.update(activity);

      runInAction(() => {
        if (activity.id) {
          const updatedActivity = {
            ...this.getActivity(activity.id),
            ...activity,
          };

          this.activityRegistry.set(activity.id, updatedActivity as Activity);
          this.selectedActivity = updatedActivity as Activity;
        }
      });
    } catch (error) {
      console.log('error', error);
    }
  };

  public deleteActivity = async (id: string): Promise<void> => {
    this.isLoading = true;

    try {
      await agent.Activities.delete(id);

      runInAction(() => {
        this.activityRegistry.delete(id);
      });
    } catch (error) {
      console.log('error', error);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

  public updateAttendance = async (): Promise<void> => {
    const user = store.userStore.user;

    this.isLoading = true;

    try {
      await agent.Activities.attend(this.selectedActivity!.id);

      runInAction(() => {
        if (this.selectedActivity?.isGoing) {
          this.selectedActivity.attendees = this.selectedActivity.attendees.filter(
            a => a.username !== user?.username,
          );
          this.selectedActivity.isGoing = false;
        } else {
          const attendee = new Profile(user!);

          this.selectedActivity?.attendees.push(attendee);
          this.selectedActivity!.isGoing = true;
        }

        this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
      });
    } catch (error) {
      console.log('error', error);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

  public cancelActivityToggle = async (): Promise<void> => {
    this.isLoading = true;

    try {
      await agent.Activities.attend(this.selectedActivity!.id);

      runInAction(() => {
        this.selectedActivity!.isCanceled = !this.selectedActivity?.isCanceled;
        this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
      });
    } catch (error) {
      console.log('error', error);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

  public clearSelectedActivity = (): void => {
    this.selectedActivity = undefined;
  };

  public updateAttendeeFollowing = (username: string): void => {
    this.activityRegistry.forEach(activity => {
      activity.attendees.forEach((attendee: Profile) => {
        if (attendee.username === username) {
          attendee.following ? attendee.followersCount-- : attendee.followersCount++;
          attendee.following = !attendee.following;
        }
      });
    });
  };
}

export default ActivityStore;
