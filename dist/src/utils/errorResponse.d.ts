export interface ErrorResponse {
    status: number;
    errorCode: string;
    message: string;
    path: string;
    timestamp: string;
}
export declare const errorResponse: (status?: number, errorCode?: string, message?: string, path?: string, timestamp?: string) => {
    status: number;
    errorCode: string;
    message: string;
    path: string;
    timestamp: string;
};
