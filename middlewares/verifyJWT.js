const jwt = require('jsonwebtoken');

const verifyJWT = async (req, res, next) => {
    const token = req.cookies.token;

    if(!token){
        req.user = null;
        return next();
    }
    try{
        const decodeToken = await jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodeToken;
        return next();
    }
    catch(error){
        req.user = null;
        return next();
    }
}

module.exports = verifyJWT;