import { makeAutoObservable, runInAction } from 'mobx';
import { v4 as uuid } from 'uuid';
import { Activity } from '../models/activity';
import agent from '../api/agent';

class ActivityStore {
  activityRegistry = new Map<string, Activity>();
  selectedActivity: Activity | undefined = undefined;
  isEditMode = false;
  isLoading = false;
  isInitialLoading = true;

  constructor() {
    makeAutoObservable(this);
  }

  get activitiesByDate() {
    return Array.from(this.activityRegistry.values()).sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
  }

  loadActivities = async (): Promise<void> => {
    try {
      const activities = await agent.Activities.list();

      activities.forEach(activity => {
        this.activityRegistry.set(activity.id, { ...activity, date: activity.date.split('T')[0] });
      });
    } catch (error) {
      console.log('error', error);
    } finally {
      runInAction(() => {
        this.isInitialLoading = false;
      });
    }
  };

  selectActivity = (id: string): void => {
    this.selectedActivity = this.activityRegistry.get(id);
  };

  cancelSelectedActivity = (): void => {
    this.selectedActivity = undefined;
  };

  openForm = (id?: string): void => {
    id ? this.selectActivity(id) : this.cancelSelectedActivity();

    this.isEditMode = true;
  };

  closeForm = (): void => {
    this.isEditMode = false;
  };

  createActivity = async (activity: Activity): Promise<void> => {
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

  updateActivity = async (activity: Activity): Promise<void> => {
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

  deleteActivity = async (id: string): Promise<void> => {
    this.isLoading = true;

    try {
      await agent.Activities.delete(id);

      runInAction(() => {
        this.activityRegistry.delete(id);

        if (this.selectedActivity?.id == id) {
          this.cancelSelectedActivity();
        }
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
