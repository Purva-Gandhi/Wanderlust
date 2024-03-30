
// const categories=[...new Set(Listing.map((item)=>{
//     return item
// }))]
// document.getElementById("searchBar").addEventListener("click",(e)=>{
//     console.log("hello")
// })
const Listing = [{
    name:"Purva"
},
{
    name:"Sonal"
}]

// Now you can use the Listing model to perform database operations or access its methods/properties

const categories=[...new Set(Listing.map((item)=>{
    return item
}))]
document.getElementById("searchBar").addEventListener("keyup",(e)=>{
    console.log("hello")
})
