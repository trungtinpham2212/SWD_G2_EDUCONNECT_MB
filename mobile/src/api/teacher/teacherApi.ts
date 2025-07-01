import axiosInstance from "@/api/axiosConfig";
import { ScheduleTeacherQueryRequest, Period } from "@/api/teacher/teacherTypes";
export const teacherApi = {
    scheule: async (payload : ScheduleTeacherQueryRequest) : Promise<Period[]> => {
        const response = await axiosInstance.get<Period[]>('/api/periods/by-date',{
            params: {
                ...payload
            }
        });
        return response.data;
    }
}