import Express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import db from './src/models/index.js';
import authRouter from './src/routers/authRouter.js';
import userRouter from './src/routers/userRouter.js';
import errorMiddleware from './src/middlewares/errorMiddleware.js';
import lawyerRouter from './src/routers/lawyerRouter.js';
import specializationRouter from './src/routers/specializationRouter.js';
import paymentRouter from './src/routers/paymentRouter.js';
import chatRouter from './src/routers/chatRouter.js';
import auditMiddleware from './src/middlewares/auditMiddleware.js';
import helmet from 'helmet';
import webhookCheck from './src/middlewares/webhookCheck.js';
import paymentController from './src/controllers/paymentController.js';
import rateLimit from 'express-rate-limit';


const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try later.',
});

const port = 3000;
const app = Express();

const apiCors = cors({
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
});

const webhookCors = cors({
  origin: '*',
  methods: ['POST'],
});

app.use('/api/v1', apiLimiter);
app.use(Express.json());
app.use(cookieParser());
app.set('trust proxy', 1);
app.use('/api/v1', apiCors);
app.post('/webhook', webhookCors, webhookCheck, paymentController.webhook);
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ['\'self\''],
      scriptSrc: ['\'self\'', '\'unsafe-inline\'', 'trusted-cdn.com'],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true },
  referrerPolicy: { policy: 'same-origin' },
}));

app.use(auditMiddleware);

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/lawyers', lawyerRouter);
app.use('/api/v1/specializations', specializationRouter);
app.use('/api/v1/payments', paymentRouter);
app.use('/api/v1/chats', chatRouter);

app.use(errorMiddleware);

// Выполнение подключения к базе данных
try {
  await db.authenticate();
  // db.sync({ force: true });
  console.log('Подключение к БД - успех!');
} catch (error) {
  console.error('Подключение к БД - пропало. Описание: \n', error);
}

app.listen(port, () => {
  console.log(`LawyerHub app backend listening on port ${port}`);
});
