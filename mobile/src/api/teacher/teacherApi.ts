import axiosInstance from "@/api/axiosConfig";
import { ScheduleTeacherQueryRequest, Period, Activity } from "@/api/teacher/teacherTypes";
import { Student } from "@/api/parent/parentTypes";

export const teacherApi = {
    scheule: async (payload : ScheduleTeacherQueryRequest) : Promise<Period[]> => {
        const response = await axiosInstance.get<Period[]>('/api/periods/by-date',{
            params: {
                ...payload
            }
        });
        return response.data;
    },
    getStudentsHomeRoom: async(teacherId: number) : Promise<Student[]> => {
        const response = await axiosInstance.get<Student[]>(`/api/students/by-teacher/${teacherId}`);
        return response.data;
    },
    getActivities: async() : Promise<Activity[]> => {
        const response = await axiosInstance.get<Activity[]>('/api/activities');
        return response.data;
    }
}