import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken'
import User from '../models/User';

type Idecoded = {
    _id?: string; 
    iat?: number; 
    exp?: number;
}

export function checkForAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const token: string | undefined = req.header('Authorization')?.replace('Bearer ', "");
        if (token) {
            const decoded: Idecoded = jwt.verify(token, "thisismytestphrase") as Idecoded;
            const user = User.findById(decoded._id)
            if (user) {
                req.query['decoded'] = decoded._id;
                req.query['token'] = token;
            } else {
                throw new Error();
            }
        } else {
            throw new Error();
        }
        next();
    } catch(err) {
        res.status(401).send(err);
    }
}