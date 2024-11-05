const { serverConfig } = require('./common/config');
const Sentry = require('@sentry/node');
const { nodeProfilingIntegration } = require('@sentry/profiling-node');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const xss = require('xss-clean');
const csrf = require('csurf');
const { errorHandler } = require('./common/errors');
const session = require('./common/middlewares/session');
require('./common/config/passaport');
const rateLimit = require('express-rate-limit');

Sentry.init({
  dsn: serverConfig.sentryDsn,
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});
const app = express();
// XSS and clickjacking protection
app.use(helmet());
// Cross-Site Scripting (XSS) protection
app.use(xss());
// Cross-Site Request Forgery (CSRF) protection
app.use(csrf());

app.use(morgan('dev'));
app.use(cookieParser());
const allowedOrigins = ['http://localhost:3000', serverConfig.CLIENT_URL];
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

// Rate limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message:
    'Too many login attempts from this IP, please try again after 15 minutes',
});

// Routes
app.use('/api/v1', loginLimiter, require('./routes'));
app.use('/api/v1/health', loginLimiter, (req, res) => {
  res.send('OK');
});

// Sentry error handler
Sentry.setupExpressErrorHandler(app);
// Custom error handler
app.use(errorHandler);

module.exports = app;
