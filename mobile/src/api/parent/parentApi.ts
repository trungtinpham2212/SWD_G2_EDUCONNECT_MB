import axiosInstance from "@/api/axiosConfig";
import {Student, PagedStudentReportResponse, TeachersOfStudentResponse, StudentFilterRequest, ChatbotSendRequest, ChatbotResponse} from '@/api/parent/parentTypes';
import { PeriodResponse } from "@/api/teacher/teacherTypes";
import { PeriodQueryparam, ReportGroupQueryParams, StudentQueryParam, TeacherQueryParam } from "@/api/shared/filterTypes";
export const parentApi = {
    getStudentsByParentId : async(payload:StudentQueryParam) : Promise<Student[]> =>{
        const response = await axiosInstance.get<Student[]>('/api/students',{
            params: {
                ...payload
            }
        });
        return response.data;
    },
    getStudentSchedule : async(payload:PeriodQueryparam) : Promise<PeriodResponse> => {
        const response = await axiosInstance.get<PeriodResponse>('/api/periods', {
            params: {
                ...payload
            }
        });
        return response.data;
    },
    getStudentReportsGroupByStId : async(payload:ReportGroupQueryParams) :Promise<PagedStudentReportResponse> => {
        // const { studentId, page, pageSize } = payload;
        const response = await axiosInstance.get<PagedStudentReportResponse>('/api/report-groups',{
            params:{
                ...payload
            }
        });
        return response.data;
    },
    getTeachersOfStudent : async(payload: TeacherQueryParam) : Promise<TeachersOfStudentResponse> =>{ 
        const response = await axiosInstance.get<TeachersOfStudentResponse>('/api/teachers',{
            params:{
                ...payload
            }
        });
        return response.data;
    },
    getChatbotMessage: async(payload: ChatbotSendRequest) : Promise<ChatbotResponse> => {
        const response = await axiosInstance.post('/api/chat-boxes', payload);
        return response.data;
    }
}