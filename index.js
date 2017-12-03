var express = require('express');
var fs = require('fs');
var app = express()

var databaseIO = require('./databaseIO');

var item1 = {
    type: 'item',
    name: 'shit'
};

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
})

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
        name: req.params.name
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
    var newitem = {
        type: 'item',
        name: req.params.name
    };
    databaseIO.add(newitem, function(feedback) {
        if (feedback.feedback == 'Success') {
            return res.send({feedback: feedback});
        }
        else {
            return res.send({feedback: feedback});
        }
    });
    return;
});


app.listen(3000);