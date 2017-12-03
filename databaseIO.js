var mongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/test'

exports.add = function(obj, callback) {
    if (obj.hasOwnProperty('type')) {
        if (obj.type === 'user') {
            mongoClient.connect(url, function(err, db) {
                if (err) throw err;
                db.collection('user').insertOne(obj, function(err, res) {
                    if (err) throw err;
                    console.log('insert user');
                    console.log(obj);
                    db.close();
                    callback({feedback: 'Success'});
                    return;
                });
            });
        }

        else if (obj.type === 'item') {
            mongoClient.connect(url, function(err, db) {
                if (err) throw err;
                db.collection('item').insertOne(obj, function(err, res) {
                    if (err) throw err;
                    console.log('insert item');
                    console.log(obj);
                    db.close();
                    callback({feedback: 'Success'});
                    return;
                });
            });
        }
        else {
            callback({feedback: 'Failure'});
            return;
        }
    }
    else{
        callback({feedback: 'Failure'});
        return;
    }
}

exports.get = function(type, callback) {
    if (type === 'user') {
        mongoClient.connect
        (url, function(err, db) {
            if (err) throw err;
            db.collection('user').find({}).toArray(function(err, result) {
                if (err) throw err;
                console.log('extract user');
                console.log(result);
                db.close();
                callback({feedback: 'Success', data: result});
                return;
            });
        });

    }
    else if (type === 'item') {
        mongoClient.connect(url, function(err, db) {
            if (err) throw err;
            db.collection('item').find({}).toArray(function(err, result) {
                if (err) throw err;
                console.log('extract item');
                console.log(result);
                db.close();
                callback({feedback: 'Success', data: result});
                return;
            });
        });
    }
    callback({feedback: 'Failure'});
    return;
}

exports.drop = function(type) {
    if (type === 'user') {
        mongoClient.connect(url, function(err, db) {
            if (err) throw err;
            db.collection('user').drop(function(err, delOK) {
                if (err) throw err;
                if (delOK) console.log('Collection user deleted');
                db.close();
            });
        });
    }
    else if(type === 'item') {
        mongoClient.connect(url, function(err, db) {
            if (err) throw err;
            db.collection('item').drop(function(err, delOK) {
                if (err) throw err;
                if (delOK) console.log('Collection item delted');
                db.close();
            });
        });
    }
}

exports.update = function(objOld, objNew) {
    if (objOld.type === 'user') {
        mongoClient.connect(url, function(err, db) {
            if (err) throw err;
            db.collection('user').updateOne(objOld, objNew, function(err, res) {
                if (err) throw err;
                console.log('update user');
                console.log(objOld);
                console.log(objNew);
                db.close();
            });
        });
    }
    else if(objOld.type === 'item') {
        mongoClient.connect(url, function(err, db) {
            db.collection('item').updateOne(objOld, objNew, function(err, res) {
                if (err) throw err;
                console.log('update item');
                console.log(objOld);
                console.log(objNew);
                db.close();
            });
        });
    }
}