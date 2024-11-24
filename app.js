if(process.env_NODE_ENV != 'production') {
   require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require('path');
const methodOverride = require("method-override"); // Middleware for supporting HTTP verbs like PUT and DELETE
const ejsMate = require("ejs-mate"); // Template engine for EJS with layout support
const ExpressError = require("./utils/ExpressError.js"); // Custom error class for handling application errors
const session = require("express-session"); // Middleware for managing sessions
const MongoStore = require('connect-mongo');
const flash = require("connect-flash"); // Middleware for displaying flash messages
const passport = require("passport"); // Authentication middleware
const LocalStrategy = require("passport-local"); // Local strategy for authentication
const User = require("./models/user.js"); // User model for handling user data

//Import route handlers
const listingRouter = require("./routes/listing.js"); // Routes for managing listings
const reviewRouter = require("./routes/review.js"); // Routes for managing reviews
const userRouter = require("./routes/user.js");


// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderLust"; // MongoDB connection string
const dbUrl = process.env.ATLASDB_URL;


// Connect to MongoDB database
main().then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
  console.log(err);
})

// Function to establish a connection to MongoDB
async function main(){
    await mongoose.connect(dbUrl);
};

// Set view engine to EJS and configure views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Middleware to parse URL-encoded data
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);  // use ejs-locals for all ejs templates:
app.use(express.static(path.join(__dirname, "/public")));




const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24*3600,
});

store.on("error", ()=>{
    console.log("error in MONGO SESSION STORE :-", err);
})

// Session configuration
const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    },
};



// app.get("/", (req, res)=>{
//     res.send("hii I am root");
// });


app.use(session(sessionOptions)); // Use session middleware
app.use(flash()); // Use flash middleware for displaying messages

// Initialize Passport for authentication
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport to use the local strategy with the User model
passport.use(new LocalStrategy(User.authenticate()));

// Serialize and deserialize user data for sessions
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Middleware to set local variables accessible in templates
app.use((req, res, next)=> {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})


// app.get("/demouser", async(req, res)=>{
//    let fakeUser = new User({
//      email: "student@gmail.com",
//      username : "delta-student"
//    });

//    const registeredUser = await User.register(fakeUser, "helloworld");
//    res.send(registeredUser);
// })



// Use imported route handlers
app.use("/listings", listingRouter); // Routes for listings
app.use("/listings/:id/reviews", reviewRouter); // Routes for reviews under specific listings
app.use("/", userRouter);


// Catch-all route for undefined routes
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