export interface User {
  id: string;
  username: string;
  email?: string;
  fullName?: string;
}

export interface Message {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    fullName?: string;
  };
}