import { Student, PagedStudentReportResponse, TeachersOfStudentResponse, StudentFilterRequest, ChatbotResponse, ChatbotSendRequest } from '@/api/parent/parentTypes';
import { PeriodResponse } from "@/api/teacher/teacherTypes";
import { parentApi } from '@/api/parent/parentApi';
import { PeriodQueryparam, ReportGroupQueryParams, StudentQueryParam, TeacherQueryParam } from "@/api/shared/filterTypes";


export const parentService = {
    getStudentsByParentId: async (payload: StudentQueryParam): Promise<Student[]> => {
        try {
            return await parentApi.getStudentsByParentId(payload);
        } catch (err) {
            console.error("Students get failed:", err);
            return [];
        }
    },
    getStudentSchedule: async (payload: PeriodQueryparam): Promise<PeriodResponse | null> => {
        try {
            return await parentApi.getStudentSchedule(payload);
        } catch (err) {
            console.error("Shedules get failed:", err);
            return null;
        }
    },
    getStudentReportsGroupByStId: async (payload: ReportGroupQueryParams): Promise<PagedStudentReportResponse | null> => {
        try {
            return await parentApi.getStudentReportsGroupByStId(payload);
        } catch (err) {
            console.error("getStudentReports get failed:", err);
            return null;
        }
    },
    getTeachersOfStudent: async (payload: TeacherQueryParam): Promise<TeachersOfStudentResponse | null> => {
        try {
            return await parentApi.getTeachersOfStudent(payload);
        } catch (err) {
            console.error("getTeachersOfStudent get failed:", err);
            return null
        }
    },
    sendChatbotMessage: async (payload: ChatbotSendRequest): Promise<ChatbotResponse | null> => {
        try {
            return await parentApi.getChatbotMessage(payload);
        } catch (err) {
            console.error("message get failed:", err);
            return null
        }
    }
}
