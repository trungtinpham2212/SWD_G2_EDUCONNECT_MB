export type ScheduleStudentQueryRequest = {
    date: string;
    classId: number
    page: number | 1;
    pageSize: number | 30;
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

export type StudentReportQueryRequest = { 
    studentId : number;
    page: number;
    pageSize: number;
}

export type PagedStudentReportResponse = {
    items : Report[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
} 

type Parent = {
    userid: number;
    fullname: string;
    email: string;
    phonenumber: string;
    address: string;
}


type StudentClass = {
    classid: number;
    classname? : string;
    grade: number;
    teacherhomeroomid: number;
    schoolyearid: number
}


export type Report = {
    reportstudentid: number;
    reportgroupid: number;
    studentid: number;
    content: string;
    status: string;
    createat: string;
    updateat: string;
    reportgroup: ReportGroup | null;
    student: Student | null;
}

type ReportGroup = {
    reportgroupid: number;
    teacherid: number;
    title: string;
    content: string;
    startdate: string;
    enddateenddate: string;
    status: string;
    createat: string;
    updateat: string;
}
