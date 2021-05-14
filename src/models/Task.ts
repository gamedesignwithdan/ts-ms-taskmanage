import mongoose, { model, Schema, Document, Types } from "mongoose";

export interface ITask extends Document {
    description: string,
    completed: boolean,
    owner: mongoose.Types.ObjectId
}

const TaskSchema = new Schema({
    description: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        required: false,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }
})

const Task = model<ITask>('Task', TaskSchema);

export default Task;