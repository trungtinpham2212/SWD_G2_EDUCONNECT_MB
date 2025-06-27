
export type ScheduleQueryRequest = {
    date: string, 
    teacherId: number
}

export type PeriodTeacher = {
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