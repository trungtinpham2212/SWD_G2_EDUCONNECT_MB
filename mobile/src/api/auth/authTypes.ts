
export type FormLoginRequest = {
  username: string;
  password: string;
}

type LoginSuccess = {
  success: true;
  data: {
    token: string;
    userId: string;
    roleId: number;
  };
};

type LoginFail = {
  success: false;
  message: string;
};
export type LoginResponse = LoginSuccess | LoginFail;

