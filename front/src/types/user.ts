export interface UserInfo {
  id: number;
  nom: string;
  prenom: string;
  image: string | null;
  telephone: string;
  adresse: string;
}

export interface User {
  id: number;
  email: string;
  roles: string[];
  userInfo: UserInfo | null;
}