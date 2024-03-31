if(process.env.NODE_ENV!="production"){
require("dotenv").config();}
// console.log(process.env.SECRET);
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const port=8080;
const path=require("path");
// const dbURL=process.env.ATLASDB_URL;
const MONGo_URL="mongodb://127.0.0.1:27017/wanderlust";
const Listing=require("./models/listing.js");
const methodoverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/Expresserror.js");
const {listingSchema,reviewSchema}=require("./joi.js");
const Review=require("./models/review.js");
const listingsRouter=require("./routes/listing.js")
const reviewsRouter=require("./routes/reviews.js")
const userRouter=require("./routes/user.js")
const cookieParser=require("cookie-parser")
const session=require("express-session")
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
// const LocalStrategy=require("passport-local").Strategy
const PassportLocalStrategy = require("passport-local").Strategy;
const User=require("./models/user.js")
app.use(cookieParser())
async function main(){
   await mongoose.connect(MONGo_URL);
}
main()
.then(()=>{
    console.log("connected");
})
.catch((err)=>{
    console.log(err);
})
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodoverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));
app.engine("ejs",ejsMate);    
app.listen(port,()=>{
    console.log("app is listening");
});
const store=MongoStore.create({
    mongoUrl:dbURL,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});
store.on("error",()=>{
    console.log("ERROR IN MONGO STORE",err)
})
const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitilized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        max:7*24*60*60*1000,
        httpOnly:true
    }
}

// app.get("/",wrapAsync((req,res,next)=>{
//     res.send("Hi i am root");
// }));

app.use(session(sessionOptions));
app.use(flash())
app.use(passport.initialize());
app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()))
passport.use(new PassportLocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// app.get("/demouser",async (req,res)=>{
//     let fakeUser=new User({
//         email:"p@gmail.com",
//         username:"delta-student"
//     })
//     //important automatically stored in database provide password check if it is unique
//     let registerUser=await User.register(fakeUser,"helloworld");
//     res.send(registerUser);
// })
app.use((req,res,next)=>{
    res.locals.success=req.flash("success")
    res.locals.error=req.flash("error")
    res.locals.currUser=req.user;
    console.log(res.locals.success)
    console.log(res.locals.error)
    next();
})
// app.get("/testListing",async(req,res)=>{
//    let samplelisting=new Listing({
//     title:"My new Villa",
//     description:"By the beach",
//     price:1200,
//     location:"Calangute,Goa",
//     country:"India"
//    });
//    await samplelisting.save();
//    console.log("sample was saved");
//    res.send("success");
// })



//very very important line to connect with listing.js makes code clean and easy to understand
app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);
//Review
//post route
// app.post("/listings/:id/reviews",async(req,res)=>{
//     let listing=await Listing.findById(req.params.id);
//     let newReview=new Review(req.body.review);
//     listing.reviews.push(newReview);
//     await newReview.save();
//     await listing.save();
//     res.send("new review saved");
// });


// app.post("/listings/:id/reviews", async (req, res) => {
//     const { id } = req.params;
    
//     try {
//         // Find the listing by ID
//         let listing = await Listing.findById(id);
//         if (!listing) {
//             return res.status(404).send("Listing not found");
//         }
        
//         // Create a new review using data from the request body
//         const newReview = new Review({
//             comment: req.body.comment,
//             rating: req.body.rating
//             // Assuming createdAt will be automatically set to the current date
//         });
        
//         // Push the new review to the listing's review array
//         listing.review.push(newReview);
        
//         // Save the new review and the updated listing
//         await newReview.save();
//         await listing.save();
        
//         console.log("New review saved");
//         res.send("New review saved");
//     } catch (error) {
//         console.error("Error saving review:", error);
//         res.status(500).send("Error saving review");
//     }
// });
app.get("/search/:key",async (req,res)=>{
    console.log(req.params.key);
    let data=await Listing.find({
        "$or":[
            {"title":{$regex:req.params.key}},
            {"price":{$regex:req.params.key}}
        ]
    })
})


//if in case no api matches with the call made by user then app.al is call which will call express error

app.all("*",(req,res,next)=>{
    // next(new ExpressError(404,"Page Not Found!!"))
    throw new ExpressError(404,"Page Not Found!!");
})
// //error handling when information is directly stored in create route without checking proper validation for example price in case of postman 
// //hoppscotch price can be interpreted as string creating errors this is where middlewares are used
// app.use((err,req,res,next)=>{
//     res.send("something went wrong!");
// });
// //custom error
// app.use((err,req,res,next)=>
//    let {status,message}=err;
//    res.status(status).send(message);

// )
// app.use((err, req, res, next) => {
//     console.error(err.stack); // Log the error for debugging purposes
//     // res.status(500).send('Something went wrong!'); 
//     // Send a generic error response
//     res.render("C:\Users\Purva\OneDrive\Desktop\majorproject\views\listings\error.ejs");
// });
// app.use((err, req, res, next) => {
//     console.error(err.stack); // Log the error for debugging purposes
//     // res.status(500).send('Something went wrong!'); 
//     // Send a generic error response
//     res.render("listings/error.ejs",errMsg);
// });
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error for debugging purposes
     // Send an error response
     res.render("listings/error.ejs",{errorMessage:err.message}) 
     // Optionally render an error page
     next();
});

