var config = require('config');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var adminid = config.get("admin");
exports.check_login = function(req, res) {
    if (!req.session.uid) {
        return false;
    }
    return true;
}
exports.check_admin = function(req, res) {
    if (! (req.session.uid === adminid)) {
        return false;
    }
    return true;
}

var transporter = nodemailer.createTransport(smtpTransport({
    service: config.get('email.service'),
    auth: {
        user: config.get("email.address"),
        pass: config.get("email.password")
    }
}));

const check_email = function(string) {
    if (string === undefined) {
        return false;
    }
    if (string.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/i) != null) {
        return true;
    }
    else {
        return false;
    }
}
exports.send_email = function(address) {
    if (config.get('email.sendemail') === 'true') {
        if (check_email(address)) {
            var mailOptions = {
                from: config.get("email.address"),
                to: address,
                subject: config.get("email.subject"),
                text: config.get("email.text")
            };
            transporter.sendMail(mailOptions, function(err, info) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log('Email sent: '+info.response);
                }
            })
        }
    }
}
exports.check_validation = function(type, string) {
    if (type === 'user') {
        var res = string.match(/[A-Z0-9\u4E00-\u9FCC]{3,20}/i);
        if (res && res[0] === string) {
            return true;
        }
        else {
            return false;
        }
    }
    else if (type === 'title') {
        var res = string.match(/[A-Z0-9/() \u4E00-\u9FCC]{0,50}/i);
        if (res && res[0] === string) {
            return true;
        }
        else {
            return false;
        }
    }
    else if (type === 'password') {
        var res = string.match(/[A-Z0-9]{3,16}/i);
        if (res && res[0] === string) {
            return true;
        }
        else {
            return false;
        }
    }
    else if (type === 'item') {
        if (string.length === 0) {
            return true;
        }
        var res = string.match(/[A-Z0-9:\\-\\,.，。()（）/ \u4E00-\u9FCC]{0,200}/i);
        if (res && res[0] === string) {
            return true;
        }
        else {
            return false;
        }
    }
    else if (type === 'email') {
        if (check_email(string)) {
            return true;
        }
        else if (string === undefined || string.length === 0) {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }

}
exports.check_id = function(string) {
    var res = string.match(/[A-Z0-9]{24}/i);
    if (res && res[0] === string) {
        return true;
    }
    else {
        return false;
    }
}
