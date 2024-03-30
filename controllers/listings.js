const Listing=require("../models/listing")
const {listingSchema,reviewSchema}=require("../joi.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN
const geocodingClient = mbxGeocoding({ accessToken:mapToken});
module.exports.index=async (req,res,next)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
    // .then((res)=>{
    //     console.log(res);
    // })

    
}
module.exports.renderForm=async  (req,res,next)=>{
    let {id}=req.params;
    // const listing=await Listing.findById(id).populate("owner") .populate("reviews")
    const listing = await Listing.findById(id)
    .populate({
        path: "owner",
        select: "username"}                
    )
    .populate({
        path:"reviews",
        populate:{
        path:"author",
        select:"username"
        }});


      
    if(!listing){
        req.flash("error","Listing does not exist");
        res.redirect("/listings")
    }
    console.log(listing)
    res.render("listings/show.ejs",{listing});
}
module.exports.newRoute=async (req,res,next)=>{
    // let {title,description,image,price,location,country}=req.body;
    // let listing=req.body.listing;
    //creating new instance
   let response=await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })      
     .send();
        
              
       
    let url=req.file.path;
    let filename=req.file.filename
    console.log(url," ",filename)
    let result=listingSchema.validate(req.body);
    if(result.error){
        throw new ExpressError(400,result.error);
    }
    const newListing=new Listing(req.body.listing);
    newListing.image={url,filename};
    console.log(req.user);
    newListing.owner=req.user._id
    console.log(newListing)
    newListing.geometry=response.body.features[0].geometry//mapbox se aa rhi hai
    console.log(newListing.geometry)
    
    let saveListing=await newListing.save();
   req.flash("success","new listing saved successfully")
    console.log(newListing)
    res.redirect("/listings");  
    
}
module.exports.editRoute=async (req,res,next)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    
    if(!listing){
        req.flash("error","Listing does not exist");
        res.redirect("/listings")
    }   
    let originalImageUrl=listing.image.url
    originalImageUrl.replace("/upload","/upload/h_300,w_250")
    res.render("listings/edit.ejs",{listing,originalImageUrl});}
module.exports.updateRoute=async (req,res,next)=>{
    let {id}=req.params;
   if(!req.body.listing){
       throw new ExpressError(400,"Send valid data for listing");
       //400 is status code when error occurs due to client error
   }
   let listing=await Listing.findById(id);  
   await Listing.findByIdAndUpdate(id,{...req.body.listing})
   if(req.file){
   let url=req.file.path
   let filename=req.file.filename
   listing.image=({url,filename});
   await listing.save()}

   req.flash("success","Listing Updated")
   res.redirect(`/listings/${id}`);
}
module.exports.deleteRoute=async (req,res,next)=>{
    let {id}=req.params;
    let deletebyid=await Listing.findByIdAndDelete(id);
 //    await Listing.find.findByIdAndDelete(deletebyid)
 req.flash("success","Deleted successfully")
    console.log(deletebyid);
    res.redirect("/listings");
 }
 module.exports.showRoute=async (req,res,next)=>{   
    
    res.render("listings/new.ejs")
}