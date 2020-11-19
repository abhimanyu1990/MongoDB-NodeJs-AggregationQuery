import mongoose from 'mongoose';

export default class DatabaseConnection {
    constructor(){
        mongoose.connect("mongodb://localhost/test_db",{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
    }
}