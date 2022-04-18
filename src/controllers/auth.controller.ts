import { validationResult } from "express-validator/check";
import HttpStatusCodes from "http-status-codes";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as _ from 'underscore';



export class authController {
    constructor() {}

    public async getCurrentUser (...params) {
        const [req, res, next] = params;
        const current_user = req['current_user']
        let toret = {
          email : current_user.email,
          firstName : current_user.firstname,
          lastName : current_user.lastname,
          isActive : current_user.isActive,
          createdAt : current_user.createdAt,
          updatedAt : current_user.updatedAt
        }
        res.json({ "current user": toret  })
    }


    public async signup(...params) {
      const [req, res] = params;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(HttpStatusCodes.BAD_REQUEST)
          .json({ errors: errors.array() });
      }
  
      const {
        email,
        password,
        username,
        lastname,
        firstname,
        isActive
      } = req.body;
      try {
        let user = await User.findOne({ where: { email: email } });
        if (user) {
          return res.status(HttpStatusCodes.BAD_REQUEST).json({
            errors: [
              {
                msg: "email already used",
              },
            ],
          });
        } 
  
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);
  
        await User.create({
          username: username,
          lastname: lastname,
          firstname: firstname,
          email: email,
          password: hashed,
          isActive: isActive,
        });
        res.json({ message: "User Registered" });
      } catch (err) {
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
      }
    }

    
    public async signin (...params) {
        const [req, res] = params;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res
            .status(HttpStatusCodes.BAD_REQUEST)
            .json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        try {
          let user;
          if(this.validateEmail(email))
              user = await User.findOne({ where:{ email : email }});

          if (!user) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json({
              errors: [
                {
                  msg: "Invalid Credentials"
                }
              ]
            });
          }
          const isMatch = bcrypt.compareSync(password, user['password'])
          if (!isMatch) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json({
              errors: [
                {
                  msg: "Invalid Credentials"
                }
              ]
            });
          }
          jwt.sign(
            {user_id :user['id']},
            process.env.SECRET,
            { expiresIn: process.env.jwtExpiration },
            (err, token) => {
              if (err) throw err;
              const payload = {
                message : "user authenticated"
              };
              payload['auth_token'] = token;
              res.json(payload);
            }
          );
        } catch (err) {
          console.error(err.message);
          res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
        }
      }


      private validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
      }

      // create hashed password
      //const salt = await bcrypt.genSalt(10);
     // const hashed = await bcrypt.hash(password, salt);

}