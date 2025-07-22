import { ScheduleTeacherQueryRequest, Period, PeriodResponse, Activity, EvaluationStudentRequest, StudentByClassIdRequest, ReportStudentResponse, ActivitiesResponse, AICreateReportGroupRequest, StudentResponse } from "@/api/teacher/teacherTypes";
import {teacherApi} from '@/api/teacher/teacherApi';
import { Student, PagedStudentReportResponse, ReportGroup } from "@/api/parent/parentTypes";
import {ReportStudentQueryParam, ReportGroupQueryParams, StudentQueryParam, ActivityQueryParam} from '@/api/shared/filterTypes';

export const teacherService = {
    scheule: async(payload:ScheduleTeacherQueryRequest) : Promise<PeriodResponse | null> =>  {
        try{
            const response = await teacherApi.getScheuleTeacher(payload);
            return response;
        }catch(error){
            console.error("Schedule get failed:", error);
            return null;
        }
    },
    getStudentsByTeacherId: async(payload: StudentQueryParam) : Promise<StudentResponse | null> => {
        try{
            return await teacherApi.getStudentsByTeacherId(payload);
        }catch(err){
            console.error("List Student get failed:", err);
            return null;
        }
    },
    getActivities: async(payload: ActivityQueryParam) : Promise<ActivitiesResponse | null> => {
        try{
            return await teacherApi.getActivities(payload);
        }catch(err){
            console.error("List Activity get failed:", err);
            return null;
        }
    },
    getStudentsByClassId: async(payload: StudentQueryParam) : Promise<Student[]> => {
        try{
            return await teacherApi.getStudentsByClassId(payload);
        }catch(err){
            console.error("List students get failed: ", err);
            return [];
        }
    },
    evaluationStudent: async(payload: EvaluationStudentRequest) => {
        try{
            return await teacherApi.evaluationStudent(payload);
        }catch(err){
            console.error("Evaluate students failed: ", err);
        }
    },
    getStudentReporstByTeacherId: async(payload:ReportGroupQueryParams ) : Promise<PagedStudentReportResponse | null> => {
        try{
            return await teacherApi.getStudentReportsByTeacherId(payload)
        }catch(err){
            console.error("Student report get failed: ", err);
            return null;
        }
    },
    getReportGroupDetailById: async(reportGroupId: number) : Promise<ReportGroup | null> => {
        try{
            return await teacherApi.getReportGroupDetailById(reportGroupId);
        }catch(err){
            console.error("Report group get failed: ", err);
            return null;
        }
    },
    getStudentReportsByReportGroupId : async(payload:ReportStudentQueryParam ) : Promise<ReportStudentResponse | null> => {
        try{
            return await teacherApi.getStudentReportsByReportGroupId(payload);
        }catch(err){
            console.error("Student report get failed: ", err);
            return null;
        }
    },
    createReportGroupWithAI: async(payload:AICreateReportGroupRequest): Promise<ReportGroup | null> => {
        try{
            return await teacherApi.createReportGroupWithAI(payload);
        }catch(err){
            console.error("Generate report failed: ", err);
            return null;
        }
    }
    
}