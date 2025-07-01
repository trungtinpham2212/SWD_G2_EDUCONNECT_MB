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
  ChildTeachers: undefined;
  ClassStudent: undefined;
  Evaluation: undefined;
  EditProfile : undefined;
  NotificationTest: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  Academic: undefined;
  Settings: undefined;
};