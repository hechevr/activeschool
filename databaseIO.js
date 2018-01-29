var mongoClient = require('mongodb').MongoClient;
var config = require('config');

var url = config.get("mongo.address");

exports.DB = {
    initialize: function(callback) {
        mongoClient.connect(url, function(err, db) {
            if (err) {
                callback({feedback: 'Failure', msg: 'Fail to connect mongo'});
                return;
            }
            db.collection('item').drop();
            db.collection('user').drop();
            db.collection('selection').drop();
            db.createCollection('item', function(err, res) {
                if (err) {
                    callback({feedback: 'Failure', msg: 'Fail to create item collection'});
                    return;
                }
            });
            db.createCollection('user', function(err, res) {
                if (err) {
                    callback({feedback: 'Failure', msg: 'Fail to create user collection'});
                    return;
                }
            });
            db.createCollection('selection', function(err, res) {
                if (err) {
                    callback({feedback: 'Failure', msg: 'Fail to create selection collection'});
                    return;
                }
            });
            callback({feedback: 'Success'});
            return;
        });
    }
}
exports.config = {
    add: function(obj, callback) {
        mongoClient.connect(url, function(err, db) {
            if (err) {
                callback({feedback: 'Failure', msg: 'Fail to connect to mongo'});
                return;
            }
            db.collection('config').insertOne(obj, function(err, res) {
                if (err) {
                    callback({feedback: 'Failure', msg:'Fail to add config'});
                    return;
                }
                db.close();
                callback({feedback: 'Success', obj: obj});
                return;
            })
        })
    },

    getOne: function(obj, callback) {
        mongoClient.connect(url, function(err, db) {
            if (err) {
                callback({feedback: 'Failure', msg:'Fail to connect to mong'});
                return;
            }
            db.collection('config').findOne(obj, function(err, res) {
                if (err) {
                    callback({feedback: 'Failure', msg: 'Fail to find obj'});
                    return;
                }
                callback({feedback: 'Success', data: res});
                return;
            })
        })
    },

    update: function(oldObj, newObj, callback) {
        mongoClient.connect(url, function(err, db) {
            if (err) {
                callback({feedback: 'Failure', msg:'Fail to connect to mong'});
                return;
            }
            db.collection('config').updateOne(oldObj, {$set: {value: newObj.value, number: newObj.number, download: newObj.download}}, function(err, res) {
                if (err) {
                    callback({feedback: 'Failure', msg: 'Fail to update obj'});
                    return;
                }
                callback({feedback: 'Success'});
                return;
            })
        })
    }
}
exports.user = {
    // add user
    add: function(obj, callback) {
        if (obj.type === 'user') {
            mongoClient.connect(url, function(err, db) {
                if (err) {
                    callback({feedback: 'Failure', msg: 'Fail to connect to mongo'});
                    return;
                }
                db.collection('user').insertOne(obj, function(err, res) {
                    if (err) {
                        callback({feedback:'Failure', msg: 'Fail to add user'});
                        return;
                    }
                    console.log('insert user');
                    console.log(obj);
                    db.close();
                    callback({feedback: 'Success', obj:obj});
                    return;
                });
            });
        }
        else {
            callback({feedback: 'Failure'});
            return;
        }
    },
    // get all users
    get: function(callback) {
        mongoClient.connect(url, function(err, db) {
            if (err) {
                callback({feedback:'Failure', msg: 'Fail to connect to mongo'});
                return;
            }
            db.collection('user').find({}).sort({date: -1}).toArray(function(err, result) {
                if (err) {
                    callback({feedback:'Failure', msg: 'Fail to get'});
                    return;
                }
                console.log('extract user');
                db.close();
                callback({feedback: 'Success', data: result});
                return;
            });
        });

    },
    // get one user (for login)
    getOne: function(condition, callback) {
        console.log(condition);
        mongoClient.connect(url, function(err, db) {
            if (err) {
                callback({feedback:'Failure', msg: 'Fail to connect to mongo'});
                return;
            }
            db.collection('user').findOne(condition, function(err, result) {
                if (err) {
                    callback({feedback:'Failure', msg: 'Fail to get'});
                    return;
                }
                db.close();
                callback({feedback: 'Success', data: result});
                return;
            });
        });
    },

    // get msg
    getAll: function(condition, callback) {
        console.log(condition);
        mongoClient.connect(url, function(err, db) {
            if (err) {
                callback({feedback: 'Failure', msg: 'Fail to connect mongo'});
                return;
            }
            db.collection('user').find(condition).sort({date: -1}).toArray(function(err, result) {
                if (err) {
                    callback({feedback: 'Failure', msg: 'Fail to get msg'});
                    return;
                }
                db.close();
                callback({feedback: 'Success', data: result});
                return;
            });
        });
    },
    // drop user collection
    drop: function() {
        mongoClient.connect(url, function(err, db) {
            if (err) {
                callback({feedback:'Failure', msg: 'Fail to connect to mongo'});
                return;
            }
            db.collection('user').drop(function(err, delOK) {
                if (err) {
                    callback({feedback:'Failure', msg: 'Fail to drop'});
                    return;
                }
                if (delOK) console.log('Collection user deleted');
                db.close();
            });
        });
    },
    updateStatus: function(objOld, objNew, callback) {
        mongoClient.connect(url, function(err, db) {
            if (err) {
                callback({feedback: 'Failure', msg: 'Fail to connect to database'});
                return;
            }
            if (objNew.status != undefined) {
                db.collection('user').updateMany(objOld, {$set: {status: objNew.status}}, function(err, res) {
                    if (err) {
                        callback({feedback: 'Failure', msg: 'Fail to update data'});
                        return;
                    }
                    db.close();
                    callback({feedback: 'Success'});
                    return;
                });
            }
            else {
                callback({feedback: 'Failure'});
                return;
            }
        });
    },
    updateInfo: function(objOld, objNew, callback) {
        mongoClient.connect(url, function(err, db) {
            if (err) {
                callback({feedback: 'Failure', msg: 'Fail to connect to database'});
                return;
            }
            if (objNew.password != undefined && objNew.email != undefined) {
                db.collection('user').update(objOld, {$set: {email: objNew.email, password: objNew.password}}, function(err, res) {
                    if (err) {
                        callback({feedback: 'Failure', msg: 'Fail to update data'});
                        return;
                    }
                    db.close();
                    callback({feedback: 'Success'});
                    return;
                });
            }
            else {
                callback({feedback: 'Failure'});
                return;
            }
        });
    },
    // update user info
    update: function(objOld, objNew, callback) {
        mongoClient.connect(url, function(err, db) {
            if (err) {
                callback({feedback: 'Failure', msg: 'Fail to connect to database'});
                return;
            }
            if (objNew.comment != undefined) {
                if (objNew.status != undefined && objNew.date != undefined) {
                    db.collection('user').updateMany(objOld, {$set: {comment: objNew.comment, status: objNew.status, date: objNew.date}}, function(err, res) {
                        if (err) {
                            callback({feedback: 'Failure', msg: 'Fail to update data'});
                            return;
                        }
                        db.close();
                        callback({feedback: 'Success'});
                        return;
                    });
                }
                else {
                    db.collection('user').updateMany(objOld, {$set: {comment: objNew.comment}}, function(err, res) {
                        if (err) {
                            callback({feedback: 'Failure', msg: 'Fail to update data'});
                            return;
                        }
                        db.close();
                        callback({feedback: 'Success'});
                        return;
                    });
                }

            }
            else if (objNew.email != undefined) {
                db.collection('user').updateOne(objOld, {$set: {email: objNew.email}}, function(err, res) {
                    if (err) {
                        callback({feedback: 'Failure', msg: 'Fail to update data'});
                        return;
                    }
                    console.log('update user');
                    console.log(objOld);
                    console.log(objNew);
                    db.close();
                    callback({feedback: 'Success'});
                    return;
                });
            }
            else {
                callback({feedback: 'Failure'});
                return;
            }
        });
    },
    // delete user
    delete: function(condition, callback) {
        mongoClient.connect(url, function(err, db) {
            if (err) {
                callback({feedback: 'Failure', msg: 'Fail to connect to database'});
                return;
            }
            db.collection('user').deleteOne(condition, function(err) {
                if (err) {
                    callback({feedback: 'Failure', msg: 'Fail to delete user'});
                    return;
                }
                callback({feedback: 'Success'});
                return;
            })
        })
    }
};

exports.item = {
    // add item
    add: function(obj, callback) {
        if (obj.status === 'active') {
            mongoClient.connect(url, function(err, db) {
                if (err) {
                    callback({feedback: 'Failure', msg: 'Fail to connect to mongo'});
                    return;
                }
                db.collection('item').insertOne(obj, function(err, res) {
                    if (err) {
                        callback({feedback:'Failure', msg: 'Fail to add item'});
                        return;
                    }
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
    },
    // get all items
    get: function(status, callback) {
        if (status === 'all') {
            mongoClient.connect(url, function(err, db) {
                if (err) {
                    callback({feedback:'Failure', msg: 'Fail to connect to mongo'});
                    return;
                }
                db.collection('item').find({}).sort({No: 1}).toArray(function(err, result) {
                    if (err) {
                        callback({feedback:'Failure', msg: 'Fail to get'});
                        return;
                    }
                    console.log('extract item');
                    db.close();
                    callback({feedback: 'Success', data: result});
                    return;
                });
            });
        }
        else {
            mongoClient.connect(url, function(err, db) {
                if (err) {
                    callback({feedback:'Failure', msg: 'Fail to connect to mongo'});
                    return;
                }
                db.collection('item').find({status:'active'}).sort({No: 1}).toArray(function(err, result) {
                    if (err) {
                        callback({feedback:'Failure', msg: 'Fail to get'});
                        return;
                    }
                    console.log('extract item');
                    db.close();
                    callback({feedback: 'Success', data: result});
                    return;
                });
            });
        }
    },
    // get one item (for itemlist)
    getOne: function(condition, callback) {
        console.log(condition);
        mongoClient.connect(url, function(err, db) {
            if (err) {
                callback({feedback:'Failure', msg: 'Fail to connect to mongo'});
                return;
            }
            db.collection('item').findOne(condition, function(err, result) {
                if (err) {
                    callback({feedback:'Failure', msg: 'Fail to get'});
                    return;
                }
                db.close();
                callback({feedback: 'Success', data: result});
                return;
            });
        });
    },
    // get all items for condition
    getAll: function(condition, callback) {
        console.log(condition);
        mongoClient.connect(url, function(err, db) {
            if (err) {
                callback({feedback: 'Failure', msg: 'Fail to connect to mongo'});
                return;
            }
            db.collection('item').find(condition).toArray(function(err, result) {
                if (err) {
                    callback({feedback: 'Failure', msg: 'Fail to get'});
                    return;
                }
                db.close();
                callback({feedback: 'Success', data: result});
                return;
            });
        });
    },
    // drop item collection
    drop: function(type) {
        if (type === 'item') {
            mongoClient.connect(url, function(err, db) {
                if (err) {
                    callback({feedback:'Failure', msg: 'Fail to connect to mongo'});
                    return;
                }
                db.collection('item').drop(function(err, delOK) {
                    if (err) {
                        callback({feedback:'Failure', msg: 'Fail to drop'});
                        return;
                    }
                    if (delOK) console.log('Collection item deleted');
                    db.close();
                });
            });
        }
        else {
            callback({feedback: 'Failure'});
            return;
        }
    },
    // update item info
    update: function(objOld, objNew, callback) {
        mongoClient.connect(url, function(err, db) {
            if (err) {
                callback({feedback: 'Failure', msg: 'Fail to connect to database'});
                return;
            }
            console.log(objOld);
            console.log(objNew);
            db.collection('item').updateMany(objOld, {$set: {time: objNew.time}}, function(err, res) {
                if (err) {
                    callback({feedback: 'Failure', msg: 'Fail to update data'});
                    return;
                }
                console.log('update item');
                db.close();
                callback({feedback: 'Success'});
                return;
            });
        });
    },

    updateStatus: function(objOld, objNew, callback) {
        mongoClient.connect(url, function(err, db) {
            if (err) {
                callback({feedback: 'Failure', msg: 'Fail to connect to database'});
                return;
            }
            db.collection('item').updateMany(objOld, {$set: {status: objNew.status}}, function(err, res) {
                if (err) {
                    callback({feedback: 'Failure', msg: 'Fail to update data'});
                    return;
                }
                console.log('update item');
                db.close();
                callback({feedback: 'Success'});
                return;
            });

        })
    },
    // update item info
    updateAll: function(objOld, objNew, callback) {
        mongoClient.connect(url, function(err, db) {
            if (err) {
                callback({feedback: 'Failure', msg: 'Fail to connect to database'});
                return;
            }
            db.collection('item').updateOne(objOld, {
                $set: {
                    status: objNew.status,
                    organization: objNew.organization,
                    No: objNew.No,
                    activity: objNew.activity,
                    target: objNew.target,
                    maxteacher: objNew.maxteacher,
                    ratio: objNew.ratio,
                    date: objNew.date,
                    time: objNew.time,
                    options: objNew.options}}, function(err, res) {
                        if (err) {
                            callback({feedback: 'Failure', msg: 'Fail to update data'});
                            return;
                        }
                        console.log('update item');
                        db.close();
                        callback({feedback: 'Success'});
                        return;
                    });
                })
            },
            // delete item
            delete: function(condition, callback) {
                mongoClient.connect(url, function(err, db) {
                    if (err) {
                        callback({feedback: 'Failure', msg: 'Fail to connect mongo'});
                        return;
                    }
                    db.collection('item').deleteOne(condition, function(err) {
                        if (err) {
                            callback({feedback: 'Failure', msg: 'Fail to delete item'});
                            return;
                        }
                        callback({feedback: 'Success'});
                        return;
                    });
                });
            }
        };

        exports.selection = {
            add: function(obj, callback) {
                mongoClient.connect(url, function(err, db) {
                    if (err) {
                        callback({feedback: 'Failure', msg: 'Fail to connect to mongo'});
                        return;
                    }
                    db.collection('selection').insertOne(obj, function(err, res) {
                        if (err) {
                            callback({feedback:'Failure', msg: 'Fail to add selection'});
                            return;
                        }
                        db.close();
                        callback({feedback: 'Success'});
                        return;
                    });
                });
            },
            get: function(callback) {
                mongoClient.connect(url, function(err, db) {
                    if (err) {
                        callback({feedback: 'Failure', msg: 'Fail to connect to mongo'});
                        return;
                    }
                    db.collection('selection').find({}).toArray(function(err, result) {
                        if (err) {
                            callback({feedback: 'Failure', msg: 'Cannot extract selection'});
                            return;
                        }
                        db.close();
                        callback({feedback: 'Success', data: result});
                        return;
                    });
                });
            },
            // get all items in collection that
            getObj: function(obj, callback) {
                mongoClient.connect(url, function(err, db) {
                    if (err) {
                        callback({feedback: 'Failure', msg: 'Fail to connect to mongo'});
                        return;
                    }
                    db.collection('selection').find(obj).toArray(function(err, result) {
                        if (err) {
                            callback({feedback: 'Failure', msg: 'Cannot get selection'});
                            return;
                        }
                        db.close();
                        callback({feedback: 'Success', data: result});
                        return;
                    });
                });
            }

        }
