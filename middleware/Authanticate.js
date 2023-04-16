const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');
const secretKey = process.env.KEY;


const authanticate = async (req, resp, next) => {
    try {

        const token = req.cookies.Amazonweb;
        const verifytoken = jwt.verify(token, secretKey);
        console.log(verifytoken);

        const rootUser = await User.findOne({ _id: verifytoken._id, "tokens.token": token });
        console.log(rootUser);

        if (!rootUser) {
            throw new Error("user not found");

        }

        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;

        next();

    } catch (error) {

        resp.status(402).send("unauthorized user : No token provide");
        console.log(error);

    }
}

module.exports = authanticate;
