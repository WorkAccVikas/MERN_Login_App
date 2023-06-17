import { Router } from "express";
/** import all controllers */
import * as controller from "../controllers/appController.js";

const router = Router();

// Todo : POST Methods
router.route("/register").post(controller.register); // register user
// router.route("/registerMail").post(); // send the email
router.route("/authenticate").post((req, res) => res.end()); // authenticate user
router.route("/login").post(controller.login); // login in app

// Todo : GET
router.route("/user/:username").get(controller.getUser); // user with username
router.route("/generateOTP").get(controller.generateOTP); // generate random OTP
router.route("/verifyOTP").get(controller.verifyOTP); // verify generated OTP
router.route("/createResetSession").get(controller.createResetSession); // reset all the variables

// Todo : PUT
router.route("/updateUser").put(controller.updateUser); // used to update the user profile
router.route("/resetPassword").put(controller.resetPassword); // use to reset password

export default router;