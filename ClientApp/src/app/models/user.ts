export interface User {
  username: string;
  displayName: string;
  token: string;
  image?: string;
}

export interface UserFormValues {
  email: string;
  password: string;
  displayName?: string;
  username?: string;
}

export interface UserActivity {
  id: string;
  title: string;
  category: string;
  date: Date;
}
