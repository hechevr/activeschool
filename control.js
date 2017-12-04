exports.check_login = function(req, res) {
    if (!req.session.uid) {
        return false;
    }
    return true;
}