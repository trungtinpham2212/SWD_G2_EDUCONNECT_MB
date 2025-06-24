import { ScheduleQueryRequest, PeriodTeacher } from "@/api/teacher/teacherTypes";
import {teacherApi} from '@/api/teacher/teacherApi';

export const teacherService = {
    scheule: async(payload:ScheduleQueryRequest) : Promise<PeriodTeacher[]> =>  {
        try{
            const response = await teacherApi.scheule(payload);
            return response;
        }catch(error){
            console.error("Schedule get failed:", error);
            return [];
        }
    }
}