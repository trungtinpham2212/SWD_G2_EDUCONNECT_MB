
export type ScheduleStudentQueryRequest = {
    date: string, 
    classId: number
}

export type Student = {
    studentid: number;
    name: string;
    dateofbirth: string;
    parentid: number;
    classid: number;
    class: StudentClass | null;
}

type StudentClass = {
    classid: number;
    classname? : string;
    grade: number;
    teacherhomeroomid: number;
    schoolyearid: number
}