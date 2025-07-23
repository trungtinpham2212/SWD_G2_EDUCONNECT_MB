import { Student } from "@/api/parent/parentTypes";

export type PaginationParams = {
    page: number;
    pageSize: number;
  };

export type ReportStudentQueryParam = PaginationParams & {
    reportGroupId?: number; 
}

export type ReportGroupQueryParams = PaginationParams & {
    id?: number;
    teacherId?: number;
    title?: string; 
    studentId?: number;
};


export type StudentQueryParam = PaginationParams & {
    teacherId?: number; 
    classId?: number;
    parentId?: number;
    name?: string;
}


export type TeacherQueryParam = PaginationParams & {
    id?:number;
    classId?: number;
    start?: string ;
    end?: string; 
    name?: string; 
}

export type ActivityQueryParam = PaginationParams & {
    isnegative: boolean,
}

export type PeriodQueryparam = PaginationParams & {
    date?: string;
    classId?: number;
}

export type StudentResponse = {
    items: Student[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}