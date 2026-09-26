export interface User {
  _id: string;
  username: string;
  token: string;
}

export interface UserMutation {
  username: string;
  password?: string;
}

export interface Recipe {
  _id: string;
  user: {
    _id: string;
    username: string;
  };
  title: string;
  recipe: string;
  image: string;
}

export interface RecipeMutation {
  title: string;
  recipe: string;
  image: File | null;
}

export interface Comment {
  _id: string;
  user: {
    _id: string;
    username: string;
  };
  recipe: string;
  text: string;
}
