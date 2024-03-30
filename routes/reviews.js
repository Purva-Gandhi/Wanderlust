const Express=require("express");
const router=Express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/Expresserror.js");
const {listingSchema,reviewSchema}=require("../joi.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const {validateReview,IsLoggedIn, isAuthor}=require("../middleware.js")
const listingController=require("../controllers/review.js")

router.post("/", IsLoggedIn,wrapAsync(listingController.createReview));

//to delete review route
// router.delete("/:reviewId",wrapAsync(async(req,res,next)=>{
//     let {id,reviewId}=req.params;
//     await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
//     await Review.findByIdAndDelete(reviewId);
//     res.redirect(`/listings/${id}`)
// }))
// Delete review route
router.delete("/:reviewId",IsLoggedIn,isAuthor, wrapAsync(listingController.deleteReview));

module.exports=router;