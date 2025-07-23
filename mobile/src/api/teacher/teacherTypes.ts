import { Report, Student } from '@/api/parent/parentTypes';


export type ScheduleTeacherQueryRequest = {
    date: string,
    teacherId: number
    page: number | 1;
    pageSize: number | 30;
}

export type Teacher = {
    teacherId: number;
    fullName: number;
    subjectName: string;
    phoneNumber: string;
    email: string;
}

export type Period = {
    periodid: number,
    subjectid: number | null,
    periodno: number,
    classid: number,
    teacherid: number | null,
    perioddate: string,
    className: string,
    subjectName: string,
    teacherName: string | null
}

export type Activity = {
    activityid: number;
    isnegative: boolean;
    activitytype: string;
}

export type ActivitiesResponse = {
    items: Activity[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}

export type PeriodResponse = {
    items: Period[],
    totalCount: number,
    pageNumber: number,
    pageSize: number,
    totalPages: number
}

export type EvaluationStudentRequest = {
    periodid: number;
    content: string;
    activityid: number; 
    students: StudentToEvaluation[]
}

export type StudentToEvaluation = {
    studentid: string;
}


// export type StudentByClassIdRequest = {
//     classId: number;
//     page: number;
//     pageSize: number;
// }

export type ReportStudentResponse = {
    items: Report[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}

export type AICreateReportGroupRequest = {
    teacherId: number;
    studentIds: number[];
    startDate: string;
    endDate: string;
} 

