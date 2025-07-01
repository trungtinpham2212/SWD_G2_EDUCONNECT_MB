
export type ScheduleTeacherQueryRequest = {
    date: string, 
    teacherId: number
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