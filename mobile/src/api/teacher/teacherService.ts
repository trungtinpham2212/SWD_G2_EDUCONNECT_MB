import { ScheduleTeacherQueryRequest, Period, PeriodResponse, Activity } from "@/api/teacher/teacherTypes";
import {teacherApi} from '@/api/teacher/teacherApi';
import { Student } from "@/api/parent/parentTypes";

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
    getStudentsByTeacherId: async(teacherId: number) : Promise<Student[]> => {
        try{
            return await teacherApi.getStudentsHomeRoom(teacherId);
        }catch(err){
            console.error("List Student get failed:", err);
            return [];
        }
    },
    getActivities: async() : Promise<Activity[]> => {
        try{
            return await teacherApi.getActivities();
        }catch(err){
            console.error("List Activity get failed:", err);
            return [];
        }
    },
    getStudentsByClassId: async(classId: number) : Promise<Student[]> => {
        try{
            return await teacherApi.getStudentsByClassId(classId);
        }catch(err){
            console.error("List students get failed: ", err);
            return [];
        }
    }
}