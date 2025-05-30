import express from 'express';
import specializationController from '../controllers/specializationController.js';


const specializationRouter = express.Router();

specializationRouter.get('/', specializationController.getAll);

export default specializationRouter;
