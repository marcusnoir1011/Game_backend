export interface SuccessResponse<T = unknown> {
    status: number;
    message: string;
    data: T;
    timestamp: string;
}

export const successResponse = <T>(
    message: string = "Success",
    data: T
): SuccessResponse<T> => ({
    status: 200,
    message,
    data,
    timestamp: new Date().toISOString(),
});
