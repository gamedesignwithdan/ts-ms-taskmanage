import { Request, Response } from 'express';
import { isValidObjectId } from "mongoose";
import { bodyValidator, controller, get, patch, post, use, del } from '../decorators'
import { UserKeys, Token } from '../models/interfaces/IUserDocument';
import User from '../models/User';
import { checkForAuth } from '../middleware/auth';

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

    // @get('/')
    // async allUsers(req: Request, res: Response) {
    //     try {
    //         const users = await User.find();
    //         res.send(users);
    //     } catch(err) {
    //         res.send(err)
    //     }
    // }

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
            const user = await User.findByIdAndDelete(id);

            if (!user) {
                res.status(404).send();
            }

            res.send(user);
        } catch(err) {
            res.status(500).send(err);
        }
    }
}
