import axiosInstance from "@/api/axiosConfig";
import { ScheduleQueryRequest, PeriodTeacher } from "@/api/teacher/teacherTypes";
export const teacherApi = {
    scheule: async (payload : ScheduleQueryRequest) : Promise<PeriodTeacher[]> => {
        const response = await axiosInstance.get<PeriodTeacher[]>('/api/Period/by-range',{
            params: {
                ...payload
            }
        });
        return response.data;
    }
}