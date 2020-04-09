const express = require('express');
const bodyParser = require('body-parser');
const httpContext = require('express-http-context');
const logger = require('./utils/logger');
const baseRouter = require('./routes');
const { errorHandler } = require('./middlewares/error-handler-middleware');
const { correlationIdAssigner } = require('./middlewares/correlation-id-assigner-middleware');


const setupServer = () => {
    const app = express();
    const { PORT = 3000 } = process.env;
    // Bodyparser middlewares
    app.use(bodyParser.urlencoded({
        extended: true,
    }));
    app.use(bodyParser.json());
    // Apply Context
    app.use(httpContext.middleware);
    // Correlation Id assigner
    app.use(correlationIdAssigner);
    // Routers middlewares
    app.use('/', baseRouter);
    // Error handlers middlewares
    app.use(errorHandler);
    // Start listening...
    app.listen(PORT, () => {
        logger.info(`Authorization-App is listening on port: ${PORT} ...`);
    });
    return app;
};

module.exports = {
    setupServer,
};
