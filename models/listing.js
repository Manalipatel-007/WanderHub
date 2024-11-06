const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title : {
    type : String,
    required : true,
  },
  description : String,
  // image : {
  //   type : String,
  //   default: "https://unsplash.com/photos/a-man-sitting-at-a-table-in-front-of-a-building-bUEEG70DP7o",
  //   set :(v) => v === ""? "https://unsplash.com/photos/a-man-sitting-at-a-table-in-front-of-a-building-bUEEG70DP7o" : v,
  // },
  image: {
    type: {
      url: {
        type: String,
        default: "https://unsplash.com/photos/a-man-sitting-at-a-table-in-front-of-a-building-bUEEG70DP7o",
        set: (v) => (v === "" ? "https://unsplash.com/photos/a-man-sitting-at-a-table-in-front-of-a-building-bUEEG70DP7o" : v),
      },
      altText: {
        type: String,
        default: "Default image",
      },
    },
    default: {},
  },
  price : Number,
  location : String,
  country : String,
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
