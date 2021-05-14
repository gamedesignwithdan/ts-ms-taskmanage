import { Request, Response, NextFunction } from 'express';
import mongoose, { isValidObjectId } from 'mongoose';
import { controller, get, patch, post, use, del } from '../decorators';
import Task from '../models/Task';
import User from '../models/User';
import { checkForAuth } from '../middleware/auth';
import { ObjectId } from 'mongodb';

@controller('/tasks')
export class TaskController {
    //  GET /tasks?completed=false OR /tasks/?completed=true
    @get('/')
    @use(checkForAuth)
    async AllMyTasks(req: Request, res: Response) {
        const match: {[key:string]: boolean} = {};

        if (req.query.completed) {
            match.completed = req.query.completed === 'true';
        }
        try {
            const user = await User.findById(req.query.decoded);
            await user?.populate({
                path: "tasks",
                match
            }).execPopulate();
            res.send(user?.tasks)
        } catch(err) {
            res.status(400).send({error: "Unauthorised!"})
        }
    }

    @get('/:id')
    @use(checkForAuth)
    async getTask(req: Request, res: Response) {
        try {
            const task = await Task.findOne({
                _id: req.params.id, 
                owner: new ObjectId(req.query.decoded as string) 
            });
            // await task?.populate('owner').execPopulate();
            if (!task) {
                return res.status(400).send();
            }
            res.send(task)
        } catch(err) {
            res.send(err)
        }
    }

    @post('/')
    @use(checkForAuth)
    async createTask(req: Request, res: Response) {
        const task = new Task({
            ...req.body,
            owner: req.query.decoded
        });
        try {
            await task.save();
            res.status(201).send(task)
        } catch(err) {
            res.status(400).send(err)
        }
    }

    @patch('/:id')
    @use(checkForAuth)
    async updateTask(req: Request, res: Response) {
        const updates = Object.keys(req.body);
        const allowedOptions = ["description", "completed"];
        const isValidOptions = updates.every((update: string) => allowedOptions.includes(update));
        if (!isValidOptions) return res.status(400).send({ error: 'Invalid updates!' });

        try {
            const task: any = await Task.findOne({
                _id: req.params.id, 
                owner: new ObjectId(req.query.decoded as string)
            })
            if (!task) return res.status(400).send({error: "Failed to find task."});
            updates.forEach(update => task[update] = req.body[update]);
            task.save();
            res.status(200).send(task)
        } catch(err) {
            res.status(400).send(err)
        }
    }

    @del('/:id')
    @use(checkForAuth)
    async deleteTaskById(req: Request, res: Response) {
        try {
            const task = await Task.findOneAndDelete({
                _id: req.params.id,
                owner: new ObjectId(req.query.decoded as string)
            });

            if (!task) {
                res.status(400).send()
            }

            res.send({operation: "Deleted the following task", task});
        } catch(err) {
            res.status(400).send(err);
        }
    }

}