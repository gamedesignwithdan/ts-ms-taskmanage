import { connect }  from 'mongoose';

const url: string  = 'mongodb://127.0.0.1:27017/task-manager-api';

connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});