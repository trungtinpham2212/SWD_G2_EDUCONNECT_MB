
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

export type UserData = {
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

type TeacherInfor = {
  teacherId: number;
  teacherName: string;
  subject: {
    subjectId: number;
    subjectName: string;
  } | null;
}


type Student = {
  studentId: number;
  name: number;
  dateOfBirth: string;
  class: {
    classId: number;
    className: string;
  } | null;
}


type UserInfor = {
  userid: number;
  fullname: string;
  email: string;
  phonenumber: string;
  address: string;
  status: true;
  roleId: number;
  avatarurl: string | null;
  teacher: TeacherInfor | null;

}