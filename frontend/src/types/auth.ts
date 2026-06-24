export type User = {
  id: string;
  username: string;
  roles: string[];
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  user: User;
  accessToken?: string | null;
};
