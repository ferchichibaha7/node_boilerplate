import { Router } from "express";
import { check } from "express-validator/check";
import * as _ from 'underscore';
import auth from "../../middleware/auth";
import { authController } from "../../controllers/auth.controller";

const router: Router = Router();
const ctrl = new authController();
const validateOptions =   [
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 8 or more characters"
    ).isLength({ min: 8 })
  ];


router.get("/me", auth,(...params) => ctrl.getCurrentUser(...params) );
router.post( "/signin",[check("password", "Password is required").exists()],(...params) => ctrl.signin(...params) );
router.post( "/signup",validateOptions,(...params) => ctrl.signup(...params));


export default router;
