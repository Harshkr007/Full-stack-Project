class ApiResponse {
    constructor(
        statusCode,
        message = "Sucess",
        data
    ){
        this.message = message;
        this.statusCode = statusCode < 400;
        this.data = data;
    }
}

export default ApiResponse;