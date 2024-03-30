const {listingSchema,reviewSchema}=require("../joi.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
module.exports.createReview=async (req, res,next) => {
    console.log("Request body:", req.body);    
    let listing = await Listing.findById(req.params.id);    
    console.log(listing);
    let newReview = new Review(req.body.reviews);
    newReview.author=req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();  
    console.log(newReview.comment);
    await listing.save();
    req.flash("success","New Review Created!");    
    res.redirect(`/listings/${listing._id}`);
}
module.exports.deleteReview=async (req, res, next) => {
    const { id, reviewId } = req.params; // Change from let to const and include reviewId
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted")
    res.redirect(`/listings/${id}`);
}
