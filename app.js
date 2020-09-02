require('dotenv').config();
const express = require("express"),
        app   = express(),
        mongoose=require('mongoose'),
        Prices=require('./models/price'),
        bodyParser=require('body-parser'),
        methodOverride=require("method-override");
var basicRoutes=require('./routes/basic');
//mongoose
mongoose.set('useUnifiedTopology',true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
var url=process.env.DATABASEURL
mongoose.connect(url,{useNewUrlParser:true});
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
// Prices.create({
//     price:11933,
//     time:Date.parse("01 Sep 2020 00:00:00 GMT")
// },function(err,t){
//     if(err){
//         console.log(err);
//         return;
//     }
//     console.log('created')
// })

//all functions

app.use(basicRoutes);
var port = process.env.PORT || 5000;
app.listen(port,()=>{
    console.log(`#LISTENING ON PORT : ${port}`);
})