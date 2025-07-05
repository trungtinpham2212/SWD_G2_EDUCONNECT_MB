import {Student, ScheduleStudentQueryRequest, StudentReportQueryRequest,PagedStudentReportResponse, TeachersOfStudentRequest, TeachersOfStudentResponse} from '@/api/parent/parentTypes';
import { PeriodResponse} from "@/api/teacher/teacherTypes";
import { parentApi } from '@/api/parent/parentApi';

export const parentService = {
    getStudentsByParentId : async(parentId: number) : Promise<Student[]> => {
        try{
            return await parentApi.getStudentsByParentId(parentId);
        }catch(err){
            console.error("Students get failed:", err);
            return [];
        }
    },
    getStudentSchedule : async(payload: ScheduleStudentQueryRequest) : Promise<PeriodResponse | null> => {
        try{
            return await parentApi.getStudentSchedule(payload);
        }catch(err){
            console.error("Shedules get failed:", err);
            return null;
        }
    },
    getStudentReports : async(payload:StudentReportQueryRequest) : Promise<PagedStudentReportResponse | null> => {
        try{
            return await parentApi.getStudentReports(payload);
        }catch(err){
            console.error("getStudentReports get failed:", err);
            return null;
        }
    },
    getTeachersOfStudent: async(payload:TeachersOfStudentRequest) : Promise<TeachersOfStudentResponse | null> =>{
        try{
            return await parentApi.getTeachersOfStudent(payload);
        }catch(err){
            console.error("getTeachersOfStudent get failed:", err);
            return null
        }
    }
}
