var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongo = require('mongodb');
var app = express();

app.use(bodyParser());
app.use(cookieParser('secret'));
app.use(session());

var databaseIO = require('./databaseIO');
var check_login = require('./control.js').check_login;
var check_admin = require('./control.js').check_admin;

app.get('/', function(req, res) {
    fs.readFile('Frontend/index.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    })
});
/*
app.get('/register', function(req, res) {
    fs.readFile('Frontend/userRegister.html', function(err, data){
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    })
});

app.get('/login', function(req, res) {
    fs.readFile('Frontend/userLogin.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    })
});

app.get('/admin', function(req, res) {
    // if (!check_admin(req, res, '5a2e9fbb94a417221c9de82f')) return res.send({feedback: 'Failure', msg: 'Not admin'});
    fs.readFile('Frontend/admin.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    })
});

app.get('/item', function(req, res) {
    fs.readFile('Frontend/item.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    })
});

app.get('/itemlist', function(req, res) {
    fs.readFile('Frontend/itemlist.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    })
});

app.get('/itemUpdate', function(req, res) {
    fs.readFile('Frontend/itemUpdate.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    })
});

app.get('/css/style.css', function(req, res) {
    fs.readFile('Frontend/css/style.css', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/css'});
        res.write(data);
        res.end();
    })
})


app.get('/items', function(req, res) {
    if (!check_login(req, res)) reutrn;
    console.log('request for item');
    databaseIO.item.get('item', function(result) {
        if (result.feedback === 'Success') {
            res.send(result.data);
        }
    });
});

app.get('/users', function(req, res) {
    if (!check_login(req, res)) reutrn;
    console.log('request for user');
    databaseIO.user.get('user', function(feedback) {
        if (feedback.feedback === 'Success') {
            res.send(feedback.data);
        }
    });
});
*/
app.post('/users', function(req, res) {
    console.log('post user');
    var newuser = {
        type: 'user',
        name: req.body.name,
        password: req.body.password
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
    if (!check_login(req, res)) return res.send({feedback: "Failure", msg: "Not Login"});
    var newitem = {
        type: 'item',
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

app.post('/item/:iid', function(req, res) {
    if (!check_login(req, res)) return res.send({feedback: 'Failure', msg: 'Fail to login'});
    var iid = req.params.iid;
    
    databaseIO.item.getOne({_id: mongo.ObjectID(iid)}, function(feedback) {
        console.log(feedback);
        if (feedback.feedback === 'Failure') res.send({feedback: 'Failure'});
        else {
            res.send({feedback: 'Success', data: feedback.data});
        }
    })
});

app.post('/item/update/:iid', function(req, res) {
    if (!check_login(req, res)) return res.send({feedback: 'Failure', msg: 'Fail to login'});
    var iid = req.params.iid;
    var updateditem = {
        _id: mongo.ObjectID(iid)
    };
    var newitem = {
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
        res.send({feedback: 'Success'});
    });
})

app.post('/itemlistdata', function(req, res) {
    console.log('get itemlist');
    if (!check_login(req, res)) return res.send({feedback: "Failure", msg: "Not login"});
    databaseIO.item.get("item", function(feedback) {
        console.log(feedback);
        if (feedback.feedback === "Failure") return res.send({feedback:'Failure', msg: 'Fail to get itemlist'});
        return res.send({feedback: 'Success', itemlist: feedback.data});
    })
});

app.post('/users/login', function(req, res) {
    console.log(req.body);
    var username = req.body.name;
    var password = req.body.password;

    console.log(username);
    console.log(password);
    
    var condition;
    if (username) {
        condition = {type: 'user', name: username, password: password};
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
    console.log(req.session);
    if (!check_login(req, res)) return res.send({feedback:'Failure', msg:'Not logged in'});
    req.session.destroy(function(err) {
        if (err) return res.send({feedback:'Failure', msg:'Error occurs when logout'});
        return res.send({feedback:'Success'});
    });
});

app.post('/selection/:uid', function(req, res) {
    if (!check_login(req, res)) return res.send({feedback:'Failure', msg:'Fail to Login'});
    var items = req.body.items;
    var uid = req.params.uid;
    for (idx in items) {
        var updateditem = {
            _id: mongo.ObjectID(items[idx]._id)
        };
        databaseIO.item.update(updateditem, {time: items[idx].time}, function(feedback) {
            if (feedback.feedback === 'Failure') return res.send({feedback: 'Failure', msg: 'Fail to update item'});
        });
    }
    databaseIO.user.update({_id: mongo.ObjectID(uid)}, {comment: req.body.comment}, function(feedback) {
        if (feedback.feedback === 'Success') {
            return res.send({feedback: 'Success'});
        }
        else {
            return res.send({feedback: 'Failure'});
        }
    })
});

app.post('/comment/:uid', function(req, res) {
    if (!check_login(req, res)) return res.send({feedback: 'Failure', msg: 'Not Logged in'});
    var uid = req.params.uid;
    databaseIO.user.getOne({_id: mongo.ObjectID(uid)}, function(feedback) {
        if (feedback.feedback === 'Success') {
            console.log(feedback);
            return res.send({feedback: 'Success', comment: feedback.data.comment});
        }
        else {
            return res.send({feedback: 'Failure'});
        }
    })
});

/*
databaseIO.DB.initialize(function(feedback) {
    console.log(feedback);
});
*/

app.use(express.static('Frontend'));
app.listen(3000);