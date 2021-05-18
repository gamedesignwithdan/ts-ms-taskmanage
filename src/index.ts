import express from 'express';
import cors from 'cors';
import multer from "multer";
require('dotenv').config();

import { AppRouter } from './AppRouter';
import './db/mongoose';
import './controllers/TaskController';
import './controllers/UserController';

const app = express();

const upload = multer({
    dest: "avatars/",
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error("Please upload a pdf file"))
        }
        cb(null, true)
    }
})

app.post("/upload", upload.single('avatar'), (req, res) => {
    console.log(req.file)
    // res.send(req.file)
})

const port = process.env.PORT || 1010;

// app.use(upload.single("avatar"))
app.use(cors())
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(AppRouter.getInstance());

app.listen(port, () => {
    console.log(`Listening! See: http://localhost:${port}`)
})