import { RequestHandler } from 'express';
import 'reflect-metadata'
import { MetadataKeys } from './MetadataKeys';
import { Methods } from './Methods';

interface RouteHandlerDescriptor extends PropertyDescriptor {
    value?: RequestHandler;
}

function routeBinder(method: string) {
    return function(path: string) {
        return function(target: any, key: string, desc: RouteHandlerDescriptor) {
            Reflect.defineMetadata(
                MetadataKeys.path, path, target, key
            );
            Reflect.defineMetadata(
                MetadataKeys.method, method, target, key
            )
        }
    }
}

export const get = routeBinder(Methods.get),
    post = routeBinder(Methods.post),
    put = routeBinder(Methods.put),
    patch = routeBinder(Methods.patch),
    del = routeBinder(Methods.del);