import { Model, model, Schema } from "mongoose";
const validator = require('validator');
const bcrypt = require('bcryptjs');
import jwt from 'jsonwebtoken';
import { IUserDocument, SafeUserResponse } from './interfaces/IUserDocument';
import Task from "./Task";

export interface IUser extends IUserDocument {
    generateAuthToken(): string;
    getPublicProfile(): SafeUserResponse;
}

export interface IUserModel extends Model<IUser> {
    findByCredentials(email: string, password: string): Promise<IUser>;
}

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value: string) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"');
            }
        }
    },
    email: {
        type: String,
        required: true,
        validate(value: string) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid");
            }
        }
    }, 
    age: {
        type: Number,
        default: 0,
        validate(value: number) {
            if (value < 0) {
                throw new Error("Age must be a positive number");
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
});

UserSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign(
        {_id: user._id.toString()},
        process.env.JWT_SECRET as string,
        {expiresIn: "7 days"}
    )
    return token
}

UserSchema.virtual('tasks', {
    ref: "Task",
    localField: "_id",
    foreignField: "owner"
})

UserSchema.methods.getPublicProfile = function () {
    const user = this as IUser;
    const {name, email, age} = user;
    let userObject = {name, email, age} as SafeUserResponse;
    return userObject;
}

UserSchema.statics.findByCredentials = async (email, password): Promise<IUser> => {
    const user = await User.findOne({ email })
    if (!user) throw new Error("Unable to login");

    const access: boolean = await bcrypt.compare(password, user.password);
    if (!access) throw new Error("Unable to login - password incorrect");
    
    return user
}

UserSchema.pre<IUser>("save", async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
    }
    this.updatedAt = new Date().toString();
    next()
})

UserSchema.pre<IUser>("remove", async function(next) {
    const user = this;
    await Task.deleteMany({owner: user._id})
    next();
})

export const User: IUserModel = model<IUser, IUserModel>('User', UserSchema);

export default User;