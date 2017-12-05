var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var app = express();

app.use(bodyParser());
app.use(cookieParser('secret'));
app.use(session());

var databaseIO = require('./databaseIO');
var check_login = require('./control.js').check_login;

app.get('/', function(req, res) {
    fs.readFile('Frontend/index.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    })
});

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

app.get('/item', function(req, res) {
    fs.readFile('Frontend/item.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    })
});

app.get('/items', function(req, res) {
    console.log('request for item');
    databaseIO.get('item', function(result) {
        if (result.feedback === 'Success') {
            res.send(result.data);
        }
    });
});

app.get('/users', function(req, res) {
    console.log('request for user');
    databaseIO.get('user', function(feedback) {
        if (feedback.feedback === 'Success') {
            res.send(feedback.data);
        }
    });
});

app.post('/users', function(req, res) {
    console.log('post user');
    var newuser = {
        type: 'user',
        name: req.body.name,
        password: req.body.password
    };
    databaseIO.add(newuser, function(feedback) {
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
    
    if (!check_login(req, res)) return;
    var newitem = {
        type: 'item',
        organization: req.body.itemorgan,
        No: req.body.itemno,
        activity: req.body.itemactivity,
        target: req.body.target,
        maxteacher: req.body.itemmaxteacher,
        ratio: req.body.itemratio,
        date: req.body.itemdate,
        options: req.body.itemoptions
    };
    databaseIO.add(newitem, function(feedback) {
        if (feedback.feedback === 'Success') {
            return res.send({feedback: feedback});
        }
        else {
            return res.send({feedback: feedback});
        }
    });
    return;
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
    databaseIO.getOne(condition, function(feedback) {
        console.log(feedback);
        if (feedback.feedback !== 'Success') return res.send({feedback: 'Failure 1', msg: 'Fail to login'});
        if (!feedback.data) return res.send({feedback: 'Failure 2', msg: 'Fail to login'});
        req.session.uid = feedback.data._id;
        return res.send({feedback: 'Success'});
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


app.listen(3000);