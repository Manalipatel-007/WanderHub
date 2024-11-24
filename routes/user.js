const express = require ("express");
const router = express.Router();  
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");


router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(wrapAsync(userController.signUp));


router.route("/login")
  .get(userController.renderLoginForm)
//Passport provides an authenticate() function, which is used as route middleware to authenticate requests.
.post(
saveRedirectUrl,
passport.authenticate("local",{
    failureRedirect : '/login', 
    failureFlash : true
}) , 
userController.login
);



router.get("/logout", userController.logout );

module.exports = router;