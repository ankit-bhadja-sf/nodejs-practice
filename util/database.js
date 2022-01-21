const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = callback => {
    MongoClient.connect('mongodb+srv://ankit:ankit123@cluster0.zjil2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
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
