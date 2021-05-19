import express from 'express';
import cors from 'cors';
require('dotenv').config();

import { AppRouter } from './AppRouter';

import './db/mongoose';
import './controllers/TaskController';
import './controllers/UserController';

const app = express();
const port = process.env.PORT;

app.use(cors())
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(AppRouter.getInstance());

if (process.env.NODE_ENV === 'production') {
	app.use(express.static('build'));
}

app.listen(port, () => {
    console.log(`Listening! See: http://localhost:${port}`)
})