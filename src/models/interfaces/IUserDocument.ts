import { Document } from "mongoose";
import Task from "../Task";

export enum UserKeys {
    name = "name",
    password = "password",
    email = "email",
    age = "age",
    createdAt = "createdAt",
    updatedAt = "updatedAt",
    tokens = "tokens",
    tasks = "tasks",
    avatar = "avatar"
}

export type SafeUserResponse = {
    name: string;
    email: string;
    age: number;
}

export type Token = {
    _id: string;
    token: string;
}

export interface IUserDocument extends Document {
    [UserKeys.name]: string;
    [UserKeys.password]: string;
    [UserKeys.email]: string;
    [UserKeys.age]: number;
    [UserKeys.createdAt]: string;
    [UserKeys.updatedAt]: string;
    [UserKeys.avatar]: Buffer | undefined;
    [UserKeys.tokens]: Token[];
    [UserKeys.tasks]: typeof Task[];
}