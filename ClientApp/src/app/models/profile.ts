import { User } from './user';

export interface IProfile {
  username: string;
  displayName: string;
  image?: string;
  bio?: string;
}

export class Profile implements IProfile {
  public username: string;
  public displayName: string;
  public image?: string | undefined;
  public bio?: string | undefined;

  constructor(user: User) {
    this.username = user.username;
    this.displayName = user.displayName;
    this.image = user.image;
  }
}
