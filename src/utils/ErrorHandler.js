class ErrHandle extends Error {
    constructor(statusCode,messages) {
        super(`Error ${statusCode} : ${messages}`);
        this.statusCode = statusCode;
        this.timestamp = new Date().toISOString();
    }
}

export { ErrHandle };