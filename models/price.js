var mongoose = require("mongoose");

var priceSchema=new mongoose.Schema({
    price:Number,
    time:Number
})

module.exports=mongoose.model("Prices",priceSchema);