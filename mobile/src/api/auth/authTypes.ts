import { Asset } from 'react-native-image-picker';

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


export type UserInfor = {
  userid: number;
  fullname: string;
  email: string;
  phonenumber: string;
  address: string;
  status: true;
  roleId: number;
  avatarUrl: string | null;
  teacher: TeacherInfor | null;
  students: Student[] | null;
}

export type UpdateProfilePayload = {
  userId: number;
  fullname: string;
  email: string;
  phoneNumber: string;
  address: string;
  avatarUri?: string; 
}

export type UpdateProfileResponse = {
  message: string;
  user: {
    userId: number;
    fullname: string;
    email: string;
    avatarUrl: string;
  }
}