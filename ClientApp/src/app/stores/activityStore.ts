import { makeAutoObservable, runInAction } from 'mobx';
import { format } from 'date-fns';

import { Activity, ActivityFormValues } from '../models/activity';
import { Profile } from '../models/profile';
import { store } from './store';
import agent from '../api/agent';

class ActivityStore {
  public activityRegistry = new Map<string, Activity>();
  public selectedActivity: Activity | undefined = undefined;
  public isEditMode = false;
  public isLoading = false;
  public isInitialLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  get activitiesByDate(): Activity[] {
    return Array.from(this.activityRegistry.values()).sort(
      (a, b) => a.date!.getTime() - b.date!.getTime(),
    );
  }

  get groupedActivities() {
    return Object.entries(
      this.activitiesByDate.reduce((activities, activity) => {
        const date = format(activity.date!, 'dd MMM yyyy');
        activities[date] = activities[date] ? [...activities[date], activity] : [activity];

        return activities;
      }, {} as Record<string, Activity[]>),
    );
  }

  public loadActivities = async (): Promise<void> => {
    this.isInitialLoading = true;

    try {
      const activities = await agent.Activities.list();

      activities.forEach(this.setActivity);
    } catch (error) {
      console.log('error', error);
    } finally {
      runInAction(() => {
        this.isInitialLoading = false;
      });
    }
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
}

export default ActivityStore;
