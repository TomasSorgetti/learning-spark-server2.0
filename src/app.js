const { serverConfig } = require('./common/config');
const Sentry = require('@sentry/node');
const { nodeProfilingIntegration } = require('@sentry/profiling-node');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { errorHandler } = require('./common/errors');
const session = require('./common/middlewares/session');
require('./common/config/passaport');

const app = express();
Sentry.init({
  dsn: serverConfig.sentryDsn,
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});

app.use(morgan('dev'));
app.use(cookieParser());
const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

session(app);

app.use('/api/v1', require('./routes'));
app.use('/api/v1/health', (req, res) => {
  res.send('OK');
});

Sentry.setupExpressErrorHandler(app); // Sentry error handler
app.use(errorHandler);

module.exports = app;
