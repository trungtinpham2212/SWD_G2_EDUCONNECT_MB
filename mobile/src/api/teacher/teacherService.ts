import { ScheduleTeacherQueryRequest, Period } from "@/api/teacher/teacherTypes";
import {teacherApi} from '@/api/teacher/teacherApi';

export const teacherService = {
    scheule: async(payload:ScheduleTeacherQueryRequest) : Promise<Period[]> =>  {
        try{
            const response = await teacherApi.scheule(payload);
            return response;
        }catch(error){
            console.error("Schedule get failed:", error);
            return [];
        }
    }
}