import e, { NextFunction, Request, RequestHandler, Response } from 'express';
import 'reflect-metadata';
import { AppRouter } from '../AppRouter';
import { MetadataKeys } from './MetadataKeys';
import { Methods } from './Methods';

function bodyValidators(keys: string[]): RequestHandler {
    return function(req: Request, res: Response, next: NextFunction) {
        if (!req.body) {
            res.status(422).send('Invalid Request');
            return;
        }
        for (let key of keys) {
            if (!req.body[key]) {
                res.status(422).send(`Missing property ${key}`);
                return;
            }
        }
        next();
    }
}


export function controller(routePrefix: string) {
    return function(target: Function) { /*this is the class*/
        const router = AppRouter.getInstance();

        for (let key in target.prototype/*methods inside class*/) {
            
            const routeHandler = target.prototype[key]; // pulls the method
            const path = Reflect.getMetadata(
                MetadataKeys.path, target.prototype, key
            );
            const method: Methods = Reflect.getMetadata(
                MetadataKeys.method, target.prototype, key
            );
            const middlewares = Reflect.getMetadata(
                MetadataKeys.middleware, target.prototype, key
            ) || [];
            const requiredBodyProps = Reflect.getMetadata(
                MetadataKeys.validator, target.prototype, key
            ) || [];

            const validator = bodyValidators(requiredBodyProps);

            if (path) {
                router[method](
                    `${routePrefix}${path}`,
                    ...middlewares,
                    validator,
                    routeHandler
                )
            }
        }
    }
}