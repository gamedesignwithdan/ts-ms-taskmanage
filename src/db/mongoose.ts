import { connect }  from 'mongoose';

const url: string  = process.env.PROD_DATABASE as string;

connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});