const protectRoute = (req, res, next) => {
    if(req.user){
        return next();
    }
    else{
        res.redirect('/signin');
    }
}

module.exports = protectRoute;