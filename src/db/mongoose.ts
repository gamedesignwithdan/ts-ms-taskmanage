import { connect }  from 'mongoose';

const url: string  = process.env.MONGO_URL as string;

connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});