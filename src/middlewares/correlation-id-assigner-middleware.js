const { v4: uuidv4 } = require('uuid');
const httpContext = require('express-http-context');

const correlationIdAssigner = (req, res, next) => {
    const correlationId = req.get('Correlation-Id') || uuidv4();
    req.correlationId = correlationId;
    httpContext.set('correlationId', correlationId);
    res.set('Correlation-Id', correlationId);
    return next();
};

exports.correlationIdAssigner = correlationIdAssigner;
