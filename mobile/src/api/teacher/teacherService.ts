import { ScheduleTeacherQueryRequest, Period } from "@/api/teacher/teacherTypes";
import {teacherApi} from '@/api/teacher/teacherApi';
import { Student } from "@/api/parent/parentTypes";

export const teacherService = {
    scheule: async(payload:ScheduleTeacherQueryRequest) : Promise<Period[]> =>  {
        try{
            const response = await teacherApi.scheule(payload);
            return response;
        }catch(error){
            console.error("Schedule get failed:", error);
            return [];
        }
    },
    getStudentsHomeRoom: async(teacherId: number) : Promise<Student[]> => {
        try{
            return await teacherApi.getStudentsHomeRoom(teacherId);
        }catch(err){
            console.error("List Student get failed:", err);
            return [];
        }
    }
}