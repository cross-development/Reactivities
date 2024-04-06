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
  followersCount: number;
  followingCount: number;
  following: boolean;
}

export class Profile implements IProfile {
  public username: string;
  public displayName: string;
  public image?: string | undefined;
  public bio?: string | undefined;
  public photos?: IPhoto[];
  public followersCount: number = 0;
  public followingCount: number = 0;
  public following: boolean = false;

  constructor(user: User) {
    this.username = user.username;
    this.displayName = user.displayName;
    this.image = user.image;
  }
}
