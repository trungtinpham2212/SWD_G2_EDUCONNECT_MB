
export type ScheduleQueryRequest = {
    startDate: string,
    endDate: string,
    teacherId: number
}

export type PeriodTeacher = {
    periodid : number,
    subjectid: number,
    periodno: number,
    classid: number,
    teacherid: number,
    perioddate: Date,
    class: ClassRoom | null,
    subject: Subject | null,

}

type ClassRoom = {
    classid: number,
    classname: string,
    grade: number,
    teacherhomeroomid: number,
    schoolyearid : number,
}

type Subject = {
    subjectid: number,
    subjectname: string,
}