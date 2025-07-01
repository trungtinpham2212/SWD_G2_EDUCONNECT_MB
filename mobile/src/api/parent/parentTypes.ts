
export type ScheduleStudentQueryRequest = {
    date: string, 
    classId: number
}

type Parent = {
    userid: number;
    fullname: string;
    email: string;
    phonenumber: string;
    address: string;
}

export type Student = {
    studentid: number;
    name: string;
    dateofbirth: string;
    parentid: number;
    classid: number;
    class: StudentClass | null;
    parent: Parent | null;
}

type StudentClass = {
    classid: number;
    classname? : string;
    grade: number;
    teacherhomeroomid: number;
    schoolyearid: number
}