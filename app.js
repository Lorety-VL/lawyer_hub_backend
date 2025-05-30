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
// import chatRouter from './src/routers/chatRouter.js';


const port = 3000;
const app = Express();

app.use(Express.json());
app.use(cookieParser())
app.use(cors());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/lawyers', lawyerRouter);
app.use('/api/v1/specializations', specializationRouter);
app.use('/api/v1/payments', paymentRouter);
// app.use('/api/v1/chats', chatRouter);

app.use(errorMiddleware);

// Выполнение подключения к базе данных
try {
  await db.authenticate();
  // await db.models.User.sync({ force: true });
  // await db.models.LawyerProfile.sync({ force: true });
  // await db.models.LawyerSpecialization.sync({ force: true });
  await db.sync({ force: true })
  console.log('Подключение к БД - успех!');
} catch (error) {
  console.error('Подключение к БД - пропало. Описание: \n', error);
}

app.listen(port, () => {
  console.log(`LawyerHub app backend listening on port ${port}`);
});
