
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
    periodid : number | null,
    subjectid: number | null,
    periodno: number | null,
    classid: number | null,
    teacherid: number| null,
    perioddate: string,
    className: string | null,
    subjectName: string | null,
    teacherName: string | null
} 

export type Activity = {
    activityid: number;
    isnegative: boolean;
    activitytype: boolean;
}

export type PeriodResponse = {
    items: Period[],
    totalCount: number,
    pageNumber: number,
    pageSize: number,
    totalPages: number
}