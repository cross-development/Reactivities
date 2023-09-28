import { makeAutoObservable } from 'mobx';
import { Activity } from '../models/activity';
import agent from '../api/agent';

class ActivityStore {
  activities: Activity[] = [];
  selectedActivity: Activity | null = null;
  isEditMode = false;
  isLoading = false;
  isInitialLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  loadActivities = async () => {
    this.setIsInitialLoading(true);

    try {
      const activities = await agent.Activities.list();

      this.activities = activities.map(a => ({ ...a, date: a.date.split('T')[0] }));
    } catch (error) {
      console.log('error', error);
    } finally {
      this.setIsInitialLoading(false);
    }
  };

  setIsInitialLoading = (state: boolean): void => {
    this.isInitialLoading = state;
  };
}

export default ActivityStore;
