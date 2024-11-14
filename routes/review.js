const express = require ("express");
const router = express.Router({mergeParams: true});  // Merge parent route parameters (e.g., ":id") into this router
const wrapAsync = require("../utils/wrapAsync.js");  // Utility for wrapping async functions to handle errors
const ExpressError = require("../utils/ExpressError.js");  /// Custom error handling utility
const { reviewSchema } = require("../schema.js"); // / Joi schema for server-side validation
const Review = require("../models/review.js");   // Mongoose model for reviews
const Listing = require("../models/listing.js"); // Mongoose model for listings


// Middleware for server-side validation of reviews
const validateReview = (req, res, next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();   // Proceed to the next middleware or route handler
    }
}

// Reviews
// post review Route
router.post("/", 
    validateReview, 
    wrapAsync(async (req, res)=>{
        console.log(req.params.id);
       let listing = await Listing.findById(req.params.id);
       let newReview  = new Review(req.body.review);
     
     listing.reviews.push(newReview);
   
     await newReview.save();
     await listing.save();
   
     res.redirect(`/listings/${listing._id}`)
   
   }));
   
   
   // // DELETE route for removing a specific review from a listing
router.delete("/:reviewId", 
    wrapAsync(async (req, res)=>{
    let {id, reviewId} = req.params;
   
        // Remove the review ID from the listing's reviews array
       await Listing.findByIdAndUpdate(id , {$pull : {reviews : reviewId}});
       await Review.findByIdAndDelete(reviewId);
       res.redirect(`/listings/${id}`);
   }))
   

   module.exports = router;