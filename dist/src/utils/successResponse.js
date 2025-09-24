export const successResponse = (message = "Success", data) => ({
    status: 200,
    message,
    data,
    timestamp: new Date().toISOString(),
});
//# sourceMappingURL=successResponse.js.map