import axiosInstance from "@/api/axiosConfig";
import { ScheduleTeacherQueryRequest, Period, Activity, PeriodResponse,EvaluationStudentRequest,StudentByClassIdRequest,ReportStudentResponse, ActivitiesResponse, AICreateReportGroupRequest, StudentResponse } from "@/api/teacher/teacherTypes";
import {ReportStudentQueryParam, ReportGroupQueryParams, StudentQueryParam, ActivityQueryParam} from '@/api/shared/filterTypes';
import { Student, PagedStudentReportResponse, ReportGroup } from "@/api/parent/parentTypes";

export const teacherApi = {
    getScheuleTeacher: async (payload : ScheduleTeacherQueryRequest) : Promise<PeriodResponse> => {
        const response = await axiosInstance.get<PeriodResponse>('/api/periods',{
            params: {
                ...payload
            }
        });
        return response.data;
    }, 
    getStudentsByTeacherId: async(payload: StudentQueryParam) : Promise<StudentResponse> => {
        const response = await axiosInstance.get<StudentResponse>('/api/students',{
            params:{
                ...payload
            }
        });
        return response.data;
    },
    getActivities: async(payload: ActivityQueryParam) : Promise<ActivitiesResponse> => {
        const response = await axiosInstance.get('/api/activities',{
            params: {
                ...payload
            }
        });
        return response.data;
    },
    getStudentsByClassId: async(payload: StudentQueryParam) : Promise<Student[]> => {
        const response = await axiosInstance.get<Student[]>('/api/students',{
            params:{
                ...payload
            }
        });
        return response.data;
    },
    evaluationStudent: async(payload: EvaluationStudentRequest) => {
        const response = await axiosInstance.post('/api/evaluations', payload);
        return response.data;
    },
    getStudentReportsByTeacherId: async(payload:ReportGroupQueryParams ) : Promise<PagedStudentReportResponse> => {
        const response = await axiosInstance.get('/api/report-groups',{
            params:{
                ...payload
            }
        });
        return response.data
    },
    getReportGroupDetailById: async(reportGroupId: number) : Promise<ReportGroup> => {
        const response = await axiosInstance.get(`/api/report-groups/${reportGroupId}`);
        return response.data;
    },
    getStudentReportsByReportGroupId : async(payload:ReportStudentQueryParam ) : Promise<ReportStudentResponse> => {
        const response = await axiosInstance.get('/api/report-students',{
            params:{
                ...payload
            }
        });
        return response.data
    },
    createReportGroupWithAI: async(payload:AICreateReportGroupRequest): Promise<ReportGroup> => {
        const response =await axiosInstance.post('/api/report-groups/ai-generate-group-report',payload);
        return response.data;
    }
}