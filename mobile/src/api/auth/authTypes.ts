
export type FormLoginRequest = {
  username: string;
  password: string;
}

type LoginSuccess = { 
  token: string;
  userName: string;
  email: string;
  roleId: number;
  userId: string;
  teacherid: number | null;
};

type LoginFail = { 
  message: string;
};
export type LoginResponse = LoginSuccess | LoginFail;

export type UserData ={
  email?: string;
  userName?: string;
  roleId?: number;
  userId?: number;
  teacherId?: number | null;
}