import { Teacher } from "@/api/teacher/teacherTypes";

// export type ScheduleStudentQueryRequest = {
//     date: string;
//     classId: number
//     page: number | 1;
//     pageSize: number | 30;
// }

export type Student = {
    studentid: number;
    studentName: string;
    name?: string;
    dateofbirth: string;
    parentid: number;
    classid: number;
    class: StudentClass | null;
    parent: Parent | null;
}
 

export type PagedStudentReportResponse = {
    items : Report[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
} 


export type TeachersOfStudentResponse = {
    items : Teacher[];
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
    title:string;
    content: string;
    startdate: string;
    enddate: string;
    status: string;
    createat: string;
    updateat: string;
    reportgroup: ReportGroup | null;
    student: Student | null;
}

export type ReportGroup = {
    reportgroupid: number;
    teacherid: number;
    title: string;
    content: string;
    startdate: string;
    enddate: string;
    status: string;
    createat: string;
    updateat: string; 
    reportStudents: Report[];
    students: Student[];
}
 
export type ChatbotSendRequest ={
    messagetext: string;
    parentId: number;
}

export type ChatbotResponse = {
    success: boolean;
    errorMessage: string;
    data: {
        messageid: number;
        chatboxid: number;
        messagetext: string;
        isparent: boolean;
        createat: string;
        chatbox: Chatbox ;
    }
}

export type Chatbox = {
    chatboxid: number;
    parentid: number;
    chatMessages: ChatMessage[];
}
export type ChatMessage = {
    messageid: number;
    chatboxid: number;
    messagetext: string;
    isparent: boolean;
    createat: string;

}
 