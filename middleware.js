const Listing = require("./models/listing");
const ExpressError=require("./utils/Expresserror.js");
const {listingSchema,reviewSchema}=require("./joi.js");
const Review=require("./models/review.js");

module.exports.IsLoggedIn=(req,res,next)=>{   
    if(!req.isAuthenticated()){
        //redirect to original page to which which user actually as redirecting but since we have created default as listings 
        
        req.session.redirectURL=req.originalURL
        req.flash("error","you must be logged in!")
       return res.redirect("/login")
    }
    next();
}

module.exports.saveRedirectURL=(req,res,next)=>{
    if(req.session.redirectURL){
        res.locals.redirectURL=req.session.redirectURL
    }
    next()
}
module.exports.isOwner=async (req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!(listing.owner._id).equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this listing")
        return res.redirect(`/listings/${id}`);
    }
   next();
}
module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);

    }
    else{
        next();
    }
};
module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);

    }
    else{
        next();
    }
};
module.exports.isAuthor=async (req,res,next)=>{
    let {id,reviewId}=req.params;
    let listing=await Review.findById(reviewId);
    if(!(listing.author).equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of this listing")
        return res.redirect(`/listings/${id}`);
    }
   next();
}
