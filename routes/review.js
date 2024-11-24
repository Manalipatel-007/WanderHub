const express = require ("express");
const router = express.Router({mergeParams: true});  // Merge parent route parameters (e.g., ":id") into this router
const wrapAsync = require("../utils/wrapAsync.js");  // Utility for wrapping async functions to handle errors
const ExpressError = require("../utils/ExpressError.js");  /// Custom error handling utility
const Review = require("../models/review.js");   // Mongoose model for reviews
const Listing = require("../models/listing.js"); // Mongoose model for listings
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js");



// Reviews
// post review Route
router.post("/", 
    isLoggedIn,
    validateReview, 
    wrapAsync(reviewController.createReview)
);
   
   
   // // DELETE route for removing a specific review from a listing
router.delete("/:reviewId", 
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview)
);
   

   module.exports = router;