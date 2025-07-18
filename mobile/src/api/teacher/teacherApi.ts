import axiosInstance from "@/api/axiosConfig";
import { ScheduleTeacherQueryRequest, Period, Activity, PeriodResponse,EvaluationStudentRequest } from "@/api/teacher/teacherTypes";
import { Student } from "@/api/parent/parentTypes";

export const teacherApi = {
    getScheuleTeacher: async (payload : ScheduleTeacherQueryRequest) : Promise<PeriodResponse> => {
        const response = await axiosInstance.get<PeriodResponse>('/api/periods/by-date',{
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
    },
    getStudentsByClassId: async(classId: number) : Promise<Student[]> => {
        const response = await axiosInstance.get<Student[]>(`/api/students/by-class/${classId}`);
        return response.data;
    },
    evaluationStudent: async(payload: EvaluationStudentRequest) => {
        const response = await axiosInstance.post('/api/evaluations', payload);
        return response.data;
    }
}