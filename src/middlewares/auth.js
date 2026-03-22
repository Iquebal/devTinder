const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const {token} = req.cookies;

    if (!token) {
      res.status(401).send("Please loggedin");
    }

    const decoded = jwt.verify(token, "DEV@Tender$789");

    const user = await User.findById(decoded._id);

    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;

    next();
  } catch (err) {
    res.status(401).send("Error: " + err.message);
  }
};

module.exports = {userAuth};
