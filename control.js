// var adminid = "5a3240fc2c740139c8bbd8c0";
var adminid = "5a379d5782a79a0b504d8d24";
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
