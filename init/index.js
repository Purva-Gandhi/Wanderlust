const mongoose=require("mongoose");
const initdata=require("./data.js");
const Listing=require("../models/listing.js");
const MONGo_URL="mongodb://127.0.0.1:27017/wanderlust";
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
//  const initDb=async ()=>{
//     await Listing.deleteMany({});
//      initdata.data=initdata.data.map((obj)=>{
//         ({...obj,owner:"6603319e145732ccb5d8d655"})
//     })
//     await Listing.insertMany(initdata.data);
//     console.log("data was initialized");
//  }
const initDb = async () => {
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({
        ...obj,
        owner: "6603319e145732ccb5d8d655"
    }));
    await Listing.insertMany(initdata.data);
    console.log("data was initialized");
}

initDb();
