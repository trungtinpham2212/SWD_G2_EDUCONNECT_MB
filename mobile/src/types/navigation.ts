// src/types/navigation.ts
export type RootStackParamList = {
  AuthStack: undefined;
  TeacherStack: undefined;
  ParentStack: undefined;
  MainStack: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainStackParamList = {
  BottomTabs: undefined;
  ParentSchedule: undefined;
  TeacherSchedule: undefined;
  Chatbot: undefined;
  ParentReport: undefined;
  TeacherReport: undefined;
  ChildTeachers: undefined;
  ClassStudent: undefined;
  Evaluation: {
    classId: number,
    periodNo: number,
    nameClass: string,
    date: string,
    nameSubject: string,
  };
  NotificationTest: undefined;
  EditProfile : undefined;
  
  CreateReport: undefined;
  TeacherReportDetail: {
    reportGroupdId : number;
  }
};

export type BottomTabParamList = {
  Home: undefined;
  Academic: undefined;
  Settings: undefined;
};