const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    let decodedToken = null;
    try {
        let token = req.get("Authorization").split(" ")[1];
        decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.role = decodedToken.role;
        req.id = decodedToken.id;
       
        next();
    }
    catch (error) {
        error.message="Not Authorized";
        error.status = 403
        next(error);
    }
}