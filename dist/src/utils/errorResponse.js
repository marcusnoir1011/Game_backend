export const errorResponse = (status = 500, errorCode = "UNKNOWN_ERROR", message = "Something went wrong", path = "/unknown", timestamp = new Date().toISOString()) => ({
    status,
    errorCode: errorCode,
    message,
    path,
    timestamp,
});
//# sourceMappingURL=errorResponse.js.map