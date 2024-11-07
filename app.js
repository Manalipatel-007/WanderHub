const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require('path');


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

app.get("/", (req, res)=>{
    res.send("hii I am root");
})

//Index route
app.get("/listings", async (req, res)=>{
   const allListings =  await Listing.find({});
   res.render("./listings/index.ejs", {allListings});
});


//New Route 
app.get("/listings/new", (req, res)=>{
    res.render("./listings/new.ejs")
})

//Show Route
app.get("/listings/:id", async (req, res)=>{
    const id = req.params.id;
    const listing = await Listing.findById(id);
    res.render("./listings/show.ejs", {listing} );
})

//Create Route
app.post("/listings", async (req, res)=>{
    // let {title, description, image, price, country, location} = req.body;
    // let listing = req.body.listing;
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    console.log(newListing);
    res.redirect("/listings");
})

//Edit Route
app.get("/listing/:id/edit", (req, res)=>{
    
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



app.listen(3000, ()=>{
    console.log("server is listening to port 3000");
});