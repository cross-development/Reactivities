import { IProfile } from './profile';

export interface IActivity {
  id: string;
  title: string;
  date: Date | null;
  description: string;
  category: string;
  city: string;
  venue: string;
  hostUsername: string;
  isCanceled: boolean;
  isGoing: boolean;
  isHost: boolean;
  host?: IProfile;
  attendees: IProfile[];
}

export class Activity implements IActivity {
  public id: string;
  public title: string;
  public date: Date | null;
  public description: string;
  public category: string;
  public city: string;
  public venue: string;
  public hostUsername: string = '';
  public isCanceled: boolean = false;
  public isGoing: boolean = false;
  public isHost: boolean = false;
  public host?: IProfile | undefined;
  public attendees: IProfile[];

  constructor(init?: ActivityFormValues) {
    Object.assign(this, init);
  }
}

export class ActivityFormValues {
  public id?: string = undefined;
  public title: string = '';
  public category: string = '';
  public description: string = '';
  public date: Date | null = null;
  public city: string = '';
  public venue: string = '';

  constructor(activity?: ActivityFormValues) {
    if (activity) {
      this.id = activity.id;
      this.title = activity.title;
      this.category = activity.category;
      this.description = activity.description;
      this.date = activity.date;
      this.city = activity.city;
      this.venue = activity.venue;
    }
  }
}
