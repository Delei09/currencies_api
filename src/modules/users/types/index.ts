export interface IUser  {
  id?: number;
  email: string;
  username: string;
  password: string;
  currenciesFavorite?: string[];
};