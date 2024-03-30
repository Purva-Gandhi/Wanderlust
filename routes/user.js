const express=require("express")
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport=require("passport");
const { saveRedirectURL} = require("../middleware.js");
// const LocalStrategy=require("passport-local").Strategy
const PassportLocalStrategy = require("passport-local").Strategy;
const listingController=require("../controllers/user.js")

router.get("/signup",listingController.renderSignUpForm)
router.post("/signup",listingController.signup);
//login
router.get("/login",listingController.renderLoginForm)


router.post("/login",saveRedirectURL, passport.authenticate("local", {
      // Redirect to listings on successful login
    failureRedirect: "/login",      // Redirect back to login on authentication failure
    failureFlash: true              // Enable flash messages for authentication failures
}),listingController.login);
router.get("/logout",listingController.logout)
    

module.exports=router