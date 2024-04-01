
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
    const searchData=e.target.value.toLowerCase();
    const filterData=categories.filter((item)=>{
        return (
            item.tiltle.toLowerCase().includes(searchData)
        )
    })
    displayItem(filterData);
})
const displayItem=(items)=>{
    document.getElementById("root").innerHTML.map((item)=>{
        var{image,title,price}=item;
    })
}