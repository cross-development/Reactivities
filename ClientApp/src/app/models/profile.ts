import { User } from './user';

export interface IPhoto {
  id: string;
  url: string;
  isMain: boolean;
}

export interface IProfile {
  username: string;
  displayName: string;
  image?: string;
  bio?: string;
  photos?: IPhoto[];
}

export class Profile implements IProfile {
  public username: string;
  public displayName: string;
  public image?: string | undefined;
  public bio?: string | undefined;
  public photos?: IPhoto[];

  constructor(user: User) {
    this.username = user.username;
    this.displayName = user.displayName;
    this.image = user.image;
  }
}
