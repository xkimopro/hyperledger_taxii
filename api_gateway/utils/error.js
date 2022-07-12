'use strict';


module.exports = class ErrorResource {


    static notAcceptable(error_id) {

        let error = {
            "title": "Not Acceptable",
            "description": "The media type provided in the Accept header is invalid",
            "error_id": error_id,
            "http_status": 406,
            "external_details": "https://docs.oasis-open.org/cti/taxii/v2.1/taxii-v2.1.html"
        }
        return error

    }

    static unauthorizedUser(error_id) {
        let error = {
            "title": "Unauthorized",
            "description": "The client needs to authenticate",
            "error_id": error_id,
            "http_status": 401,
            "external_details": "https://docs.oasis-open.org/cti/taxii/v2.1/taxii-v2.1.html"
        }
        return error
    }

    static notFound(error_id, description) {
        let error = {
            "title": "Not Found",
            "description": description,
            "error_id": error_id,
            "http_status": 404,
            "external_details": "https://docs.oasis-open.org/cti/taxii/v2.1/taxii-v2.1.html"
        }
        return error

    }

    

}