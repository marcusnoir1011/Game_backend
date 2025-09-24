export interface ErrorResponse {
    status: number;
    errorCode: string;
    message: string;
    path: string;
    timestamp: string;
}

export const errorResponse = (
    status: number = 500,
    errorCode: string = "UNKNOWN_ERROR",
    message: string = "Something went wrong",
    path: string = "/unknown",
    timestamp: string = new Date().toISOString()
) => ({
    status,
    errorCode: errorCode,
    message,
    path,
    timestamp,
});
