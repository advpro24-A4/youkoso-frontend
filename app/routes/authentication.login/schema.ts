export interface LoginResponse {
  message: string;
  user: User;
  token: string;
}

export type User = {
  id: string;
  email: string;
  role: string;
  profile?: Profile;
};

export type Profile = {
  name: string;
  username: string;
  address: string;
  birth_date: string;
  phone_number: string;
};
