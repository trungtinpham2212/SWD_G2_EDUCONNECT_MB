import axiosInstance from "@/api/axiosConfig";
import {Student, ScheduleStudentQueryRequest} from '@/api/parent/parentTypes';
import { Period } from "@/api/teacher/teacherTypes";

export const parentApi = {
    getStudentsByParentId : async(parentId:number) : Promise<Student[]> =>{
        const response = await axiosInstance.get<Student[]>(`/api/students/parent/${parentId}`);
        return response.data;
    },
    getStudentSchedule : async(payload:ScheduleStudentQueryRequest) : Promise<Period[]> => {
        const response = await axiosInstance.get<Period[]>('/api/periods/by-date-class', {
            params: {
                ...payload
            }
        });
        return response.data;
    }
}