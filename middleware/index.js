function CheckLogin(req, res, next) {
    
    if (req.session.UserLogin === true) {
        next();
    } else {
        res.redirect('/');
    }
}

module.exports = {
    CheckLogin
};