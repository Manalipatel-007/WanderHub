const express = require ("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js")
const {listingSchema} = require("../schema.js");  //Joi schema
const Listing = require("../models/listing.js");


// for server side validation
const validateListing = (req, res, next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}


//Index route
router.get("/", async (req, res)=>{
    const allListings =  await Listing.find({});
    res.render("./listings/index.ejs", {allListings});
 });
 
 
 //New Route 
 router.get("/new", async (req, res)=>{
     res.render("./listings/new.ejs")
 })
 
 //Show Route
 router.get("/:id", async (req, res)=>{
     const id = req.params.id;
     const listing = await Listing.findById(id).populate("reviews");
     res.render("./listings/show.ejs", {listing} );
     
 });


 
//Create Route
router.post("/", validateListing,
    wrapAsync (async (req, res, next)=>{

        const { listing } = req.body;

    // Ensure image defaults are applied if not provided
    if (!listing.image || !listing.image.url) {
        listing.image = {}; // Triggers Mongoose to apply default values
    }

        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
    })
);


//Edit Route
router.get("/:id/edit", 
    wrapAsync(async (req, res , next)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", { listing});
})
);


//update Route
router.put("/:id", validateListing,
    wrapAsync (async(req, res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
})
);


//Delete Route
router.delete("/:id", 
    wrapAsync(async(req, res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");

})
);

module.exports = router;