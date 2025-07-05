
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
  teacherId: number | null;
  fullname?: string;
  phoneNumber?: string;
  address?: string;
  avatarURL: string | null;
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
  fullname?: string;
  phoneNumber?: string;
  address?: string;
  avatarURL: string | null;
}

export type TeacherInfor = {
  teacherid : number;
  userid: number;
  subjectid: number;
  user: UserInfor;
}

type UserInfor = {
  userid:number;
  fullname: string;
  email: string;
  phonenumber: string;
  address: string;
  status: true;
  roleid: number;
  avatarurl: string | null;
}