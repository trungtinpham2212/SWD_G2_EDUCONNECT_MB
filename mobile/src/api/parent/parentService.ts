import {Student, ScheduleStudentQueryRequest} from '@/api/parent/parentTypes';
import { Period } from "@/api/teacher/teacherTypes";
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
    getStudentSchedule : async(payload: ScheduleStudentQueryRequest) : Promise<Period[]> => {
        try{
            return await parentApi.getStudentSchedule(payload);
        }catch(err){
            console.error("Shedules get failed:", err);
            return [];
        }
    }
}
