// const mongodb = require('mongodb');
const mongoose = require('mongoose');

// const MongoClient = mongodb.MongoClient;  mongodb+srv://ankit:ankit123@cluster0.zjil2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

let _db;

const mongoConnect = callback => {
    mongoose.connect('mongodb://localhost:27017/nodeproject')
        .then(client => {
            console.log('connected');
            _db = client.db();
            callback();

        })
        .catch(err => {
            console.log(err);
        })
}

const getDb = () => {
    if (_db) {
        return _db
    }
    throw 'No Database Found'
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
