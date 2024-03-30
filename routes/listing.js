const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/Expresserror.js");
const {listingSchema,reviewSchema}=require("../joi.js");
const Listing=require("../models/listing.js");
const passport=require("passport");
const {IsLoggedIn, isOwner,validateListing}=require("../middleware.js")
// const LocalStrategy=require("passport-local").Strategy
const PassportLocalStrategy = require("passport-local").Strategy;
const listingController=require("../controllers/listings.js")


const multer  = require('multer')
const {storage}=require("../cloudConfig.js")
const upload = multer({ storage })//will store in clod storage


//index route
router.get("/",wrapAsync(listingController.index));
// router.post("/",IsLoggedIn,validateListing, upload.single("listing[image]"),listingController.newRoute  )
   
    // res.send(req.file);

  


//new route
router.get("/new",IsLoggedIn,wrapAsync(listingController.showRoute));
//show route
router.get("/:id",wrapAsync(listingController.renderForm));
//create route
//new rute and post in listings
router.post("/",IsLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.newRoute));
//edit
router.get("/:id/edit",IsLoggedIn,isOwner,wrapAsync(listingController.editRoute));
//update route 
router.put("/:id",IsLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateRoute));
//delete
router.delete("/:id",IsLoggedIn,isOwner,wrapAsync(listingController.deleteRoute));
module.exports=router;