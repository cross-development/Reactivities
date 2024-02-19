import { makeAutoObservable, runInAction } from 'mobx';
import { v4 as uuid } from 'uuid';

import { Activity } from '../models/activity';
import agent from '../api/agent';

class ActivityStore {
  activityRegistry = new Map<string, Activity>();
  selectedActivity: Activity | undefined = undefined;
  isEditMode = false;
  isLoading = false;
  isInitialLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  get activitiesByDate(): Activity[] {
    return Array.from(this.activityRegistry.values()).sort(
      (a, b) => Date.parse(a.date) - Date.parse(b.date),
    );
  }

  get groupedActivities() {
    return Object.entries(
      this.activitiesByDate.reduce((activities, activity) => {
        const date = activity.date;
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
    this.activityRegistry.set(activity.id, {
      ...activity,
      date: activity.date.split('T')[0],
    });
  };

  private getActivity = (id: string): Activity | undefined => {
    return this.activityRegistry.get(id);
  };

  public createActivity = async (activity: Activity): Promise<void> => {
    this.isLoading = true;

    activity.id = uuid();

    try {
      await agent.Activities.create(activity);

      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
        this.isEditMode = false;
      });
    } catch (error) {
      console.log('error', error);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

  public updateActivity = async (activity: Activity): Promise<void> => {
    this.isLoading = true;

    try {
      await agent.Activities.update(activity);

      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
        this.isEditMode = false;
      });
    } catch (error) {
      console.log('error', error);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
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
}

export default ActivityStore;
