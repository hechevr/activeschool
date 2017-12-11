exports.check_login = function(req, res) {
    if (!req.session.uid) {
        return false;
    }
    return true;
}
exports.check_admin = function(req, res, adminid) {
    if (! (req.session.uid === adminid)) {
        return false;
    }
    return true;
}