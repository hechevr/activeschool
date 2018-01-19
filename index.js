var express = require('express');
var fs = require('fs');
var multer = require('multer');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongo = require('mongodb');

var app = express();
var uploadImg = multer({dest: './Frontend/image/Photonew'});
var uploadPdf = multer({dest: './Frontend/resourcenew'})

app.use(bodyParser());
app.use(cookieParser('secret'));
app.use(session());

var port = 80;

var databaseIO = require('./databaseIO');
var check_login = require('./control.js').check_login;
var check_admin = require('./control.js').check_admin;
var send_email = require('./control.js').send_email;
var check_validation = require('./control.js').check_validation;
var check_id = require('./control.js').check_id;

app.get('/', function(req, res) {
    if (check_login(req, res)) {
        if (check_admin(req, res)) {
            fs.readFile('Frontend/admin.html', function(err, data) {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                res.end();
            });
        }
        else {
            fs.readFile('Frontend/itemlist.html', function(err, data) {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                res.end();
            });
        }
    }
    else {
        fs.readFile('Frontend/login.html', function(err, data) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        })
    }

});

app.get('/admin.html', function(req, res) {
    if (check_admin(req, res)) {
        fs.readFile('Frontend/admin.html', function(err, data) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        });
    }
    else {
        fs.readFile('Frontend/login.html', function(err, data) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        });
    }

});

app.get('/title', function(req, res) {
    if (!check_login(req, res)) {
        return res.send({feedback: 'Failure', msg:'Not valid user'});
    }
    databaseIO.config.getOne({name: 'title'}, function(feedback) {
        if (feedback.feedback === 'Failure') {
            return res.send({feedback: 'Failure', msg: 'Fail to get title'});
        }
        // console.log(feedback);
        return res.send({feedback: 'Success', value: feedback.data.value, number: feedback.data.number});
    });
});

app.post('/title/update', function(req, res) {
    if (!check_admin(req, res)) {
        return res.send({feedback:'Failure', msg: 'Not valid user'});
    }
    if (!check_validation('title', req.body.title)) return res.send({feedback: 'Failure', msg: 'Wrong format'});
    if (typeof(req.body.number) !== 'number') return res.send({feedback: 'Failure', msg: 'Wrong Format'});
    databaseIO.config.update({name: 'title'}, {value: req.body.title, number: req.body.number}, function(feedback) {
        if (feedback.feedback === 'Failure') {
            return res.send({feedback:'Failure', msg: 'Fail to update title'});
        }
        // console.log(feedback);
        return res.send({feedback: 'Success'});
    });
});


app.post('/users', function(req, res) {
    console.log('post user');
    console.log(req.body);
    if (!check_validation('user', req.body.name) || !check_validation('email', req.body.email) || !check_validation('password', req.body.password)) {
        return res.send({feedback: 'Failure'});
    }
    var newuser = {
        type: 'user',
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        status: "active",
        date: new Date().toString(),
    };
    databaseIO.user.add(newuser, function(feedback) {
        if (feedback.feedback === 'Success') {
            return res.send({feedback: feedback});
        }
        else {
            return res.send({feedback: feedback});
        }
    });
    return;
});

app.post('/items', function(req, res) {
    console.log('post item');
    if (!check_admin(req, res)) return res.send({feedback: "Failure", msg: "Not Login"});
    if (!check_validation('item', req.body.organization)) return res.send({feedback: 'Failure'});
    if (!check_validation('item', req.body.No)) return res.send({feedback: 'Failure'});
    if (!check_validation('item', req.body.activity)) return res.send({feedback: 'Failure'});
    if (!check_validation('item', req.body.target)) return res.send({feedback: 'Failure'});
    if (!check_validation('item', req.body.maxteacher)) return res.send({feedback: 'Failure'});
    if (!check_validation('item', req.body.ratio)) return res.send({feedback: 'Failure'});
    if (!check_validation('item', req.body.date)) return res.send({feedback: 'Failure'});
    if (!check_validation('item', req.body.options)) return res.send({feedback: 'Failure'});
    var newitem = {
        status: 'active',
        organization: req.body.organization,
        No: req.body.No,
        activity: req.body.activity,
        target: req.body.target,
        maxteacher: req.body.maxteacher,
        ratio: req.body.ratio,
        date: req.body.date,
        time: req.body.time,
        options: req.body.options
    };
    databaseIO.item.add(newitem, function(feedback) {
        if (feedback.feedback === 'Success') {
            return res.send({feedback: feedback});
        }
        else {
            return res.send({feedback: feedback});
        }
    });
    return;
});
/*
app.post('/items/selection', function(req, res) {
console.log('get item selection');
if (!check_login(req, res)) return res.send({feedback: 'Failure', msg: 'Not login'});
var obj = {
item: req.body.item
};
databaseIO.selection.getObj(obj, function(feedback) {
if (feedback.feedback === 'Success') {
return res.send({feedback: feedback.feedback, data: feedback.data});
}
else {
return res.send({feedback: feedback});
}
});
});

app.post('users/selection', function(req, res) {
console.log('get user selection');
if (!check_login(req, res)) return res.send({feedback: 'Failure', msg: 'Not Login'});
var obj = {
user: req.body.user
};
databaseIO.selection.getObj(obj, function(feedback) {
if (feedback.feedback === 'Success') {
return res.send({feedback: feedback.feedback, data:feedback.data});
}
else {
return res.send({feedback: feedback});
}
});
});
*/


app.post('/itemlistdata', function(req, res) {
    console.log('get itemlist');
    if (!check_login(req, res)) return res.send({feedback: "Failure", msg: "Not login"});
    databaseIO.item.get("active", function(feedback) {
        // console.log(feedback);
        if (feedback.feedback === "Failure") return res.send({feedback:'Failure', msg: 'Fail to get itemlist'});
        return res.send({feedback: 'Success', itemlist: feedback.data});
    })
});

app.post('/users/login', function(req, res) {
    // console.log(req.body);
    var email = req.body.email;
    var password = req.body.password;

    // console.log(username);
    // console.log(password);
    if (!email || !password) return res.send({feedback: 'Failure'});
    if (!check_validation('email', email)) return res.send({feedback: 'Failure'});
    if (!check_validation('password', password)) return res.send({feedback: 'Failure'});
    var condition;
    if (email) {
        condition = {email: email, password: password};
    }
    else {
        return res.send({feedback: 'Failure', msg: 'Fail to login'});
    }
    databaseIO.user.getOne(condition, function(feedback) {
        console.log(feedback);
        if (feedback.feedback !== 'Success') return res.send({feedback: 'Failure 1', msg: 'Fail to login'});
        if (!feedback.data) return res.send({feedback: 'Failure 2', msg: 'Fail to login'});
        req.session.uid = feedback.data._id;
        return res.send({feedback: 'Success', _id: feedback.data._id});
    });
});

app.post('/users/logout', function(req, res) {
    // console.log(req.session);
    if (!check_login(req, res)) return res.send({feedback:'Failure', msg:'Not logged in'});
    req.session.destroy(function(err) {
        if (err) return res.send({feedback:'Failure', msg:'Error occurs when logout'});
        return res.send({feedback:'Success'});
    });
});
/*
app.post('/users/update/:uid', function(req, res) {
var uid = req.params.uid;
if (!check_login(req, res)) return res.send({feedback:'Failure', msg:'Fail to Login'});
if (req.session.uid !== uid) return res.send({feedback: 'Failure', msg: 'Not valid user'});
if (!check_validation('email',req.body.oldprofile.email)) return res.send({feedback: 'Failure'});
if (!check_validation('password', req.body.oldprofile.password)) return res.send({feedback: 'Failure'});
if (!check_validation('email',req.body.newprofile.email)) return res.send({feedback: 'Failure', msg: 'Wrong format'});
if (!check_validation('password', req.body.newprofile.password)) return res.send({feedback: 'Failure', msg: 'Wrong format'});
databaseIO.user.getOne(
{
_id:mongo.ObjectID(uid),
email:req.body.oldprofile.email,
password:req.body.oldprofile.password,
}, function(feedback) {
if (feedback.feedback != 'Success' || !feedback.data) return res.send({feedback:'Failure', msg:'Wrong info'});
else {
databaseIO.user.updateInfo(
{_id: mongo.ObjectID(uid)},
{
password: req.body.newprofile.password,
email: req.body.newprofile.email
},
function(fb) {
if (fb.feedback === 'Success') {
return res.send({feedback: 'Success'});
}
else {
return res.send({feedback: 'Failure'});
}
}

)
}
})
});
*/
app.post('/selection/:uid', function(req, res) {
    if (!check_login(req, res)) return res.send({feedback:'Failure', msg:'Fail to Login'});
    var items = req.body.items;
    var uid = req.params.uid;
    if (req.session.uid !== uid) return res.send({feedback: 'Failure', msg: 'Not valid user'});
    if (!check_validation('item', req.body.comment)) return res.send({feedback: 'Failure', msg:'Not valid number'});
    for (idx in items) {
        var updateditem = {
            _id: mongo.ObjectID(items[idx]._id)
        };
        databaseIO.item.update(updateditem, {time: items[idx].time}, function(feedback) {
            if (feedback.feedback === 'Failure') {
                return res.send({feedback: 'Failure', msg: 'Fail to update item'});
            }
        });
    }
    databaseIO.user.update({_id: mongo.ObjectID(uid)}, {comment: req.body.comment, status: "decline", date: new Date().toString()}, function(feedback) {
        if (feedback.feedback === 'Success') {
            if (req.body.email != undefined && req.body.email != null) {
                send_email(req.body.email);
            }
            return res.send({feedback: 'Success'});
        }
        else {
            return res.send({feedback: 'Failure'});
        }
    });

});

app.post('/comment/:uid', function(req, res) {
    if (!check_login(req, res)) return res.send({feedback: 'Failure', msg: 'Not Logged in'});
    var uid = req.params.uid;
    if (!check_id(uid)) return res.send({feedback: 'Failure', msg: 'Wrong id'});
    databaseIO.user.getOne({_id: mongo.ObjectID(uid)}, function(feedback) {
        if (feedback.feedback === 'Success') {
            // console.log(feedback);
            return res.send({feedback: 'Success', comment: feedback.data.comment, status: feedback.data.status, email:feedback.data.email});
        }
        else {
            return res.send({feedback: 'Failure'});
        }
    })
});

app.post('/admin/delete/:iid', function(req, res) {
    if (!check_admin(req, res)) return res.send({feedback: 'Failure', msg: 'Not valid admin'});
    var uid = req.params.iid;
    if (!check_id(uid)) return res.send({feedback: 'Failure', msg: 'Wrong id'});
    databaseIO.item.delete({_id: mongo.ObjectID(uid)}, function(feedback) {
        if (feedback.feedback === 'Success') {
            // console.log(feedback);
            return res.send({feedback: 'Success'});
        }
        else {
            return res.send({feedback: 'Failure'});
        }
    });
});


app.post('/admin/item/detail/:iid', function(req, res) {
    if (!check_admin(req, res)) return res.send({feedback: 'Failure', msg: 'Not valid user'});
    var iid = req.params.iid;
    if (iid.length != 24) return res.send({feedback: 'Failure'});
    databaseIO.item.getOne({_id: mongo.ObjectID(iid)}, function(feedback) {
        console.log(feedback);
        if (feedback.feedback === 'Failure') return res.send({feedback: 'Failure'});
        else {
            return res.send({feedback: 'Success', data: feedback.data});
        }
    })
});

app.get('/admin/msg', function(req, res) {
    if (!check_admin(req, res)) return res.send({feedback: 'Failure', msg: 'Not valid user'});
    databaseIO.user.getAll({status: 'decline'}, function(feedback) {
        if (feedback.feedback === 'Failure') {
            res.send({feedback: 'Failure', msg: 'Fail to get msg'});
        }
        else {
            res.send({feedback: 'Success', data: feedback.data});
        }
    })
});

app.get('/admin/msg/delete/:uid', function(req, res) {
    if (!check_admin(req, res)) return res.send({feedback: 'Failure', msg: 'Not valid user'});
    var uid = req.params.uid;
    databaseIO.user.update({_id: mongo.ObjectID(uid)}, {comment: ""}, function(feedback) {
        if (feedback.feedback === 'Success') {
            return res.send({feedback: 'Success'});
        }
        else {
            return res.send({feedback: 'Failure'});
        }
    })
});

app.post('/admin/itemlistdata', function(req, res) {
    if (!check_admin(req, res)) return res.send({feedback: 'Failure', msg: "Not valid user"});
    databaseIO.item.get("all", function(feedback) {
        // console.log(feedback);
        if (feedback.feedback === "Failure") return res.send({feedback:'Failure', msg: 'Fail to get itemlist'});
        return res.send({feedback: 'Success', itemlist: feedback.data});
    })
})

app.post('/admin/item/update/:iid', function(req, res) {
    if (!check_admin(req, res)) return res.send({feedback: "Failure", msg: "Not Login"});

    var iid = req.params.iid;
    if (!check_id(iid)) return res.send({feedback: 'Failure', msg: 'Wrong id'});
    var updateditem = {
        _id: mongo.ObjectID(iid)
    };
    var newitem = {
        status: req.body.status,
        organization: req.body.organization,
        No: req.body.No,
        activity: req.body.activity,
        target: req.body.target,
        maxteacher: req.body.maxteacher,
        ratio: req.body.ratio,
        date: req.body.date,
        time: req.body.time,
        options: req.body.options
    };
    databaseIO.item.updateAll(updateditem, newitem, function(feedback) {
        if (feedback.feedback === 'Failure') return res.send({feedback: 'Failure', msg: 'Fail to update item'});
        return res.send({feedback: 'Success'});
    });
});

app.post('/admin/user/detail/:uid', function(req, res) {
    var uid = req.params.uid;
    if (!check_admin(req, res) && uid !== req.session.uid) return res.send({feedback: 'Failure', msg: 'Not valid user'});
    if (!check_id(uid)) return res.send({feedback: 'Failure', msg: 'Wrong id'});
    // console.log({_id: mongo.ObjectID(uid)});
    databaseIO.user.getOne({_id: mongo.ObjectID(uid)}, function(feedback) {
        if (feedback.feedback === 'Failure') return res.send({feedback: 'Failure'});
        else {
            return res.send({feedback: 'Success', data: feedback.data});
        }
    })
});
app.post('/admin/user/delete/:uid', function(req, res) {
    if (!check_admin(req, res)) return res.send({feedback: 'Failure', msg: 'Not valid user'});
    var uid = req.params.uid;
    if (!check_id(uid)) return res.send({feedback: 'Failure', msg: 'Wrong id'});
    // console.log({_id: mongo.ObjectID(uid)});
    databaseIO.user.delete({_id: mongo.ObjectID(uid)}, function(feedback) {
        if (feedback.feedback === 'Success') {
            return res.send({feedback: 'Success'});
        }
        else {
            return res.send({feedback: 'Failure'});
        }
    })
});
app.post('/admin/user/update/:uid', function(req, res) {
    if (!check_admin(req, res)) return res.send({feedback: 'Failure', msg: 'Not valid user'});
    var uid = req.params.uid;
    if (!check_id(uid)) return res.send({feedback: 'Failure', msg: 'Wrong id'});
    console.log(req.body);
    if (req.body.email != undefined) {
        if (!check_validation('email', req.body.email)) return res.send({feedback: 'Failure', msg: 'Invalid format'});
        if (!check_validation('user', req.body.name)) return res.send({feedback: 'Failure', msg: 'Invalid format'});
        if (!check_validation('password', req.body.password)) return res.send({feedback: 'Failure', msg: 'Invalid format'});

        databaseIO.user.update({_id: mongo.ObjectID(uid)}, {email: req.body.email, name: req.body.name, password: req.body.password}, function(feedback) {
            if (feedback.feedback === 'Success') {
                return res.send({feedback: 'Success'});
            }
            else {
                return res.send({feedback: 'Failure'});
            }
        });
    }
    else if (req.body.status != undefined) {
        if (req.body.status == 'active' || req.body.status == 'decline') {
            databaseIO.user.updateStatus({_id: mongo.ObjectID(uid)}, {status: req.body.status}, function(feedback) {
                if (feedback.feedback === 'Success') {
                    return res.send({feedback: 'Success'});
                }
                else {
                    return res.send({feedback: 'Failure'});
                }
            });
        }
        else {
            return res.send({feedback: 'Failure'});
        }
    }
    else {
        return res.send({feedback: 'Failure'});
    }

})

app.post('/admin/users', function(req, res) {
    if (!check_admin(req, res)) return res.send({feedback: 'Failure', msg: 'Not valid user'});
    databaseIO.user.get(function(feedback) {
        if (feedback.feedback === 'Failure') return res.send({feedback: 'Failure'});
        else {
            return res.send({feedback: 'Success', data: feedback.data});
        }
    })
})
/*
databaseIO.DB.initialize(function(feedback) {
console.log(feedback);
});
*/
app.post('/admin/initialize', function(req, res) {
    console.log('initialize');
    databaseIO.user.update({}, {comment: "", status:'active'}, function(feedback) {
        console.log(feedback);
        if (feedback.feedback === 'Success') {
            databaseIO.user.updateStatus({}, {comment: "", status:'active'}, function(feedback) {
                if (feedback.feedback !== 'Success') {
                    return res.send({feedback: 'Failure'});
                }
            });
            databaseIO.item.updateStatus({}, {status: 'decline'}, function(fb) {
                if (fb.feedback !== "Success") {
                    return res.send({feedback: 'Failure'});
                }
                else {
                    return res.send({feedback: 'Success'});
                }
            })
        }
        else {
            return res.send({feedback: 'Failure'});
        }
    });
});

app.post('/admin/photo/:pid', uploadImg.single('image'), function(req, res) {
    // if (!check_admin(req, res)) return res.send({feedback: 'Failure', msg: 'Not valid user'});
    var pid = req.params.pid;
    var pidint = parseInt(pid);
    if (pidint === null) return res.send({feedback: 'Failure', msg: 'wrong pid'});
    if (pidint < 1 || pidint > 17) return res.send({feedback: 'Failure', msg: 'wrong pid'});
    var file = "./Frontend/image/Photonew/" + pid + ".jpg";
    fs.rename(req.file.path, file, function(err) {
        if (err) {
            console.log(err);
            return res.send({feedback: 'Failure'});
        }
        else {
            return res.send({feedback: 'Success'});
        }
    });
});

app.post('/admin/pdf/:pid', uploadPdf.single('pdf'), function(req, res) {
    var pid = req.params.pid;
    if (pid !== 'application' && pid !== 'info' && pid !== 'letter') return res.send({feedback: 'Failure', msg: 'wrong pid'});
    var file = './Frontend/resourcenew/' + pid + '.pdf';
    fs.rename(req.file.path, file, function(err) {
        if (err) {
            console.log(err);
            return res.send({feedback: 'Failure'});
        }
        else {
            return res.send({feedback: 'Success'});
        }
    })
})



app.use(express.static('Frontend'));
app.use(express.static('image'));
app.get('*', function(req, res) {
    res.status(404).send('Null');
});
app.listen(port, "0.0.0.0", function() {
    console.log('Listening to port: ' + port);
});
