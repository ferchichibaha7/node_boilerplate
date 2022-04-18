import HttpStatusCodes from "http-status-codes";
import jwt from "jsonwebtoken";
import User from "../models/User";

export default async function(req, res, next) {
  try {
  // Get token from header
  const token = req.headers.authorization.split(" ")[1];
  // Verify token and return current_user inside REQ
    const payload  = jwt.verify(token, process.env.SECRET);
    await User.findOne({ where: { id:payload['user_id'] } }).then((user) =>{
    req.current_user = user
  }
    );

    next();
  } catch (err) {
    res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .json({ msg: "Token is not valid" });
  }
}
