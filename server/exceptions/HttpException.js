class HttpException extends Error {
    /**
     * @description constructor
     * 
     * @param {status, message, code, client_message} 
     */
    constructor({status, message, code, client_message}) {
        super(message);
        this.name = "HttpException";
        this.status = status;
        this.message = message;
        this.detail = message;
        this.client_message = client_message? client_message: message;
        this.code = code;
    }
    
    logAll(logger) {
        logger.info(JSON.stringify(this));
    }
}

module.exports = HttpException;