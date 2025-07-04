import axiosInstance from "@/api/axiosConfig";
import {Student, ScheduleStudentQueryRequest, StudentReportQueryRequest, PagedStudentReportResponse} from '@/api/parent/parentTypes';
import { PeriodResponse } from "@/api/teacher/teacherTypes";

export const parentApi = {
    getStudentsByParentId : async(parentId:number) : Promise<Student[]> =>{
        const response = await axiosInstance.get<Student[]>(`/api/students/parent/${parentId}`);
        return response.data;
    },
    getStudentSchedule : async(payload:ScheduleStudentQueryRequest) : Promise<PeriodResponse> => {
        const response = await axiosInstance.get<PeriodResponse>('/api/periods/by-date-class', {
            params: {
                ...payload
            }
        });
        return response.data;
    },
    getStudentReports : async(payload:StudentReportQueryRequest) :Promise<PagedStudentReportResponse> => {
        const { studentId, page, pageSize } = payload;
        const response = await axiosInstance.get<PagedStudentReportResponse>(`/api/report-students/student/${studentId}`,{
            params: {
                page , pageSize
            }
        });
        return response.data;
    }
}