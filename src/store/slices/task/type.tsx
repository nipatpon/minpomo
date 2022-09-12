
// Revamp Types

export type TTaskForm = {
    id: number | null;
    uuid: string | null;
    title: string | null;
    date: Date;
    startTime: string;
    pomoDuration: number;
    shortBreakDuration: number;
    longBreakDuration: number;
    roundLimit: number;
    round: number;
    status: "new" | "inprogress" | "success";
    category: "generals" | "think" | "health" | "music" | "comunicate";
}

export type TFilters = {
    search: string;
    status: 'idle';
    startDate: string | undefined,
    endDate: string | undefined
}

export type TSort = {
    oderBy: 'ASC' | 'DESC';
    field: 'id';
} 

// ------------------------------ 
export interface TaskForm {
    status: "idle" | "pending";
    error: object | null;
    currentRequestId: string | undefined;
    form: TTaskForm;
} 
// ------------------------------
export interface TasksState {
    status: "idle" | "pending";
    error: object | null;
    currentRequestId: string | undefined;
    currentFormID: number | null;
    currentFormIndex: number | null;
    currentLanguage: 'en' | 'th';
    filters: TFilters | {} | undefined;
    sort: TSort | {} | undefined;
    forms: TTaskForm[] | []
}