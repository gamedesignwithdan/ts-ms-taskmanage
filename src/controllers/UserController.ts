import { Request, Response, NextFunction } from 'express';
import { isValidObjectId } from "mongoose";
import { bodyValidator, controller, get, patch, post, use, del } from '../decorators'
import { UserKeys, Token } from '../models/interfaces/IUserDocument';
import User from '../models/User';
import { checkForAuth } from '../middleware/auth';
import multer from 'multer';
import sharp from 'sharp';
import { EmailControl } from '../EmailControl';

const upload = multer({
    // dest: "avatars/",
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error("Please upload correct file type - png, jpg, jpeg"))
        }
        cb(null, true)
    }
}).single('avatar')

// Promise wrapping the Multer upload
const multerPromise = (req: Request, res: Response) => {
    return new Promise((resolve, reject) => {
        upload(req, res, (err: any) => {
            if(!err) {
                console.log("File successfully attached to request.")
                resolve(req)
            }
            reject(err);
        });
    });
};

const uploadMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await multerPromise(req, res);
        next();
    } catch(err) {
        res.status(400).send({error: err.message})
    }
};

@controller('/users')
export class UserController {
    @get('/me')
    @use(checkForAuth)
    async getLoggedIn(req: Request, res: Response) {
        const id = req.query.decoded;
        try {
            const user = await User.findById(id);
            let tokenForResponse: Token = {_id: user?.id, token: typeof req.query.token === "string" ? req.query.token : ""};
            let bool: boolean  = false
            user?.tokens.forEach((token) => {
                if (token.token === req.query.token) {
                    bool = true
                }
            });
            if (!bool || !user) {
                return res.send({error: "Please authenticate by signing in again."});
            }
            res.status(200).send({user: user.getPublicProfile(), token: tokenForResponse})
        } catch(err) {
            res.status(404).send(err)
        }
    }

    @get('/:id/avatar')
    async getUserAvatar(req: Request, res: Response) {
        try {
            const user = await User.findById(req.params.id);
            if (!user || !user.avatar) {
                throw new Error();
            }

            res.set('Content-Type', 'image/jpg')
            res.send(user.avatar);
        } catch(err) {

        }
    }

    @post('/me/avatar')
    @use(uploadMiddleware)
    @use(checkForAuth)
    async uploadFile(req: Request, res: Response) {
        try {
            const user = await User.findById(req.query.decoded);
            if (!user) return res.status(400).send({error: "no user found"});
            const buffer: Buffer = await sharp(req.file.buffer).resize({ width: 500, height: 500 }).png().toBuffer();
            
            user.avatar = buffer;
            await user.save();

            res.status(200).send(user)
        } catch(err) {
            res.status(400).send(err)
        }
    }

    @del('/me/avatar')
    @use(checkForAuth)
    async deleteFile(req: Request, res: Response) {
        try {
            const user = await User.findById(req.query.decoded);
            if (!user) return res.status(400).send({error: "no user found"});
            user.avatar = undefined;
            await user.save();
            EmailControl.sendCancellationEmail(user.email, user.name);
            res.status(200).send(user);
        } catch(err) {
            res.status(400).send(err)
        }
    }

    @get('/account-birthday')
    @use(checkForAuth)
    async getAccountBirthday(req: Request, res: Response) {
        try {
            const user = await User.findById(req.query.decoded)
            if (!user) {
                return res.status(400).send();
            }
            res.send(user.createdAt)
        } catch(err) {

        }
    }

    @bodyValidator('email', 'password')
    @post('/login')
    async loginUser(req: Request, res: Response) {
        try {
            const user = await User.findByCredentials(req.body.email, req.body.password)
            const tokenString: string = await user.generateAuthToken();
            user.tokens = user.tokens.concat({ _id: user.id, token: tokenString })
            user.save();
            res.status(201).send({user: user.getPublicProfile(), token: tokenString})
        } catch(err) {
            res.status(401).send({err: "Failed to authorise user - please check your password and email are correct."})
        }
    }

    @post('/logout')
    @use(checkForAuth)
    async logoutUser(req: Request, res: Response) {
        try {
            const user = await User.findById(req.query.decoded);
            const requestToken = req.query.token;
            if (user?.tokens[0] !== undefined) {
                user.tokens = user.tokens.filter(token => requestToken !== token.token);
                user.save();
            }

            res.send();
        } catch(err) {
            res.status(400).send(err);
        }
    }

    @post("/logoutAll")
    @use(checkForAuth)
    async logoutAllJWTs(req: Request, res: Response) {
        try {
            const user = await User.findById(req.query.decoded);
            if (user) {
                user.tokens = [];
                user.save();
            }

            res.status(200).send();
        } catch(err) {
            res.status(400).send(err);
        }
    }

    @post('/')
    async createUser(req: Request, res: Response) {
        const user = new User(req.body)
        const tokenString = await user.generateAuthToken();
        user.tokens = user.tokens.concat({ _id: user.id, token: tokenString })
        try {
            await user.save();
            EmailControl.sendWelcomeEmail(user.email, user.name);
            res.status(201).send({user: user.getPublicProfile()});
        } catch(err) {
            res.status(400).send(err);
        }
    }

    // @get('/:id')
    // async getUser(req: Request, res: Response) {
    //     try {
    //         let user;
    //         if (isValidObjectId(req.params.id)) {
    //             user = await User.findById(req.params.id);
    //         }

    //         if (!user) {
    //             return res.status(404).send({ error: 'Failed to find this user' })
    //         } 
    //         res.status(200).send({user: user.getPublicProfile()});
    //     } catch (err) {
    //         res.status(500).send(err)
    //     }
    // }

    @get('/')
    async allUsers(req: Request, res: Response) {
        try {
            const users = await User.find();
            res.send(users);
        } catch(err) {
            res.send(err)
        }
    }

    @patch('/me')
    @use(checkForAuth)
    async updateMe(req: Request, res: Response) {
        const updates: UserKeys[] = Object.keys(req.body) as UserKeys[];
        const allowedUpdates: UserKeys[] = [UserKeys.name, UserKeys.password, UserKeys.email, UserKeys.age]; // enum
        const isValidOptions = updates.every((update: string) => allowedUpdates.includes(update as UserKeys))
        if (!isValidOptions) return res.status(400).send({ error: 'Invalid updates!' })
        const id = req.query.decoded;
        try {
            // not sure how to fix the bug that comes from changing any to IUser | null
            const user: any = isValidObjectId(req.params.id) ? await User.findById(id) : null; 
            if (!user) return res.status(400).send();
            updates.forEach((update: UserKeys) => user[update] = req.body[update]);
            user.save();
            res.status(200).send({user: user.getPublicProfile()})
        } catch(err) {
            res.status(400).send(err)
        }
    }

    @del('/me')
    @use(checkForAuth)
    async deleteMe(req: Request, res: Response) {
        const id = req.query.decoded;
        try {
            const user = await User.findById(id);
            user?.remove();

            if (!user) {
                res.status(404).send();
            }

            res.send(user);
        } catch(err) {
            res.status(500).send(err);
        }
    }
}
