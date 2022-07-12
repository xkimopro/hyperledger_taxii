
module.exports = {
    checkHeaders: (req, res, next) => {
        res.setHeader('Content-Type', 'application/taxii+json;version=2.1')
        if (!req.headers.accept || req.headers.accept != 'application/taxii+json;version=2.1') {
            res.status(406).send({
                "error" : req.request_uuid
            })
            return
        }
        next();
    },
};
