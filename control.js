var config = require('config');

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
