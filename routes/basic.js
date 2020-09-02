const { version } = require('mongoose');

require('dotenv').config();
var app=require('express'),
    router=app.Router(),
    Binance=require('binance-api-node').default,
    Prices=require('../models/price');
//Setting up binance
const myClient=Binance({
    apiKey:process.env.BINANCE_API_KEY,
    apiSecret:process.env.BINANCE_SECRET_KEY
});
/////////////////////////////////////////////////////////////////////////
router.get('/lastActivity',async(req,res)=>{
    try{
        var c=await assetRateAtBuy();
        res.send(c)
    }catch(e){
        console.log(e);
    }
})
router.get('/',async(req,res)=>{
    res.render("index");
})
router.get("*",function(req,res){
    res.send("Page Not Found");
})
module.exports=router;


























////////////////////////////////////////////////////////////////////////
async function getBalance(coinname)
{
    var myAccount=await myClient.accountInfo();
    return myAccount.balances.find(e=>e.asset==coinname).free;
}
async function findAllbalances()
{
    var myAccount=await myClient.accountInfo();
    return myAccount.balances.filter(e=>e.free>0);
}

module.exports=router

async function getFuturesPrice(coinname)
{
    var allfuturePrices=await myClient.futuresPrices();
    return allfuturePrices[`${coinname}USDT`]
}

async function getAllAssetsInfo(){
    var allCoinbalances=await findAllbalances();
    for(d of allCoinbalances)
    {
        var price=0;
        if(d.asset==="USDT")
        {
            price='1';
        }
        else
        {
            price = await getFuturesPrice(d.asset)
        }
        d.price=price;
    }
    allCoinbalances.sort((a,b)=>{
        return (b.price*b.free)-(a.price*a.free);
    })
    return allCoinbalances;
}
async function assetRateAtBuy()
{
    var allAssets=await getAllAssetsInfo();
    for(d of allAssets)
    {
        var orders=[]
        var trades=[]
        if(d!=='USDT')
        {
            orders =await myClient.allOrders({symbol:`${d.asset}USDT`});
            orders.sort((a,b)=>{
                return b.time-a.time
            })
            orders=orders.filter(d=>{return d.status==="FILLED"})
            trades =await myClient.myTrades({symbol:`${d.asset}USDT`});
            trades.sort((a,b)=>{
                return b.time-a.time
            })
        }
        d.orders=orders;
        d.trades=trades;
        if(d.orders.length>0)
        {
            d.lastTransPrice=d.orders[0].price;
            d.lastTransType=d.orders[0].side;
            d.percentageDiff=(((d.price-d.lastTransPrice)/d.lastTransPrice)*100).toFixed(2);
        }
    }
    allAssets=allAssets.filter(d=>{

        return (d.orders.length > 0 || d.trades.length>0) && d.lastTransType==='BUY'
    })
    return allAssets
}







