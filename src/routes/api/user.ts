import { userController } from '../../controllers/user.controller';
import { Router } from "express";
import { check } from "express-validator/check";
import auth from '../../middleware/auth';
import admin from '../../middleware/admin';


const router: Router = Router();
const ctrl = new userController();


router.get( "/list",auth,(...params) => ctrl.findAllUsers(...params));
router.delete( "/delete/:id",auth,admin,(...params) => ctrl.deleteUser(...params));
router.get( "/:id",auth,admin,(...params) => ctrl.findOneUser(...params));
// router.put( "/:id",auth,admin,(...params) => ctrl.updateUser(...params));


export default router;
