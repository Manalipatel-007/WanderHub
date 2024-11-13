const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require('path');
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")
const {listingSchema} = require("./schema.js");
const Review = require("./models/review.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderLust"

main().then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
  console.log(err);
})

async function main(){
    await mongoose.connect(MONGO_URL);
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);  // use ejs-locals for all ejs templates:
app.use(express.static(path.join(__dirname, "/public")));


app.get("/", (req, res)=>{
    res.send("hii I am root");
})

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
app.get("/listings", async (req, res)=>{
   const allListings =  await Listing.find({});
   res.render("./listings/index.ejs", {allListings});
});


//New Route 
app.get("/listings/new", async (req, res)=>{
    res.render("./listings/new.ejs")
})

//Show Route
app.get("/listings/:id", async (req, res)=>{
    const id = req.params.id;
    const listing = await Listing.findById(id);
    res.render("./listings/show.ejs", {listing} );
    
    
})

//Create Route
app.post("/listings", validateListing,
    wrapAsync (async (req, res, next)=>{
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
    })
);


//Edit Route
app.get("/listings/:id/edit", 
    wrapAsync(async (req, res , next)=>{
    if(!req.body.listing){
      throw new ExpressError(400, "send valid data for listing");
    }
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", { listing});
})
);


//update Route
app.put("/listings/:id", validateListing,
    wrapAsync (async(req, res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
})
);


//Delete Route
app.delete("/listings/:id", 
    wrapAsync(async(req, res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id).then(()=>{
        res.redirect("/listings");
    })
    .catch((err)=>{
        console.log(err);
    })

})
);

// Reviews
// post Route
app.post("/listings/:id/reviews", async (req, res)=>{
  let listing = await Listing.findById(req.params.id);
  let newReview  = new Review(req.body.review);
  
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  res.redirect(`/listings/${listing._id}`)

})

// app.get("/testListing", async (req, res)=>{
//     let sampleListing = new Listing({
//         title : "My New Villa",
//         description : "by the beach",
//         price : 1200,
//         location : "calangute, Goa",
//         country : "India",
//     })

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successfull");
// });


app.all("*" , (req, res , next)=>{
    next(new ExpressError(404 , "Page Not Found!"));
})


///-------------Define middleware to handle errors -------------------
app.use((err, req, res, next)=>{
    let {statusCode=500, message="Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs", {message});
    // res.status(statusCode).send(message);
})


app.listen(3000, ()=>{
    console.log("server is listening to port 3000");
});