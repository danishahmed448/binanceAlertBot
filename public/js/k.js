
var i=0;
$(document).ready(function(){
    function update_trackdata(){
        $.get('/lastActivity').then(d=>{
           var panel=document.getElementById('table')
           d.forEach(elem=>{
               if(!document.getElementById(`${elem.asset}${elem.lastTransType}`))
               {
                var priceDiv=document.createElement('tr');
                priceDiv.setAttribute('id',`${elem.asset}${elem.lastTransType}`)
                priceDiv.innerHTML=`
                <th scope="row">${i}</th>
                <td class="coinName">${elem.asset}</td>
                <td class="${elem.lastTransType}">${elem.lastTransType}</td>
                <td class="${elem.percentageDiff<0 ? 'neg' : 'pos'}" id="${elem.asset}${elem.lastTransType}percent">${elem.percentageDiff}%</td>
                `
                panel.append(priceDiv);
                i=i+1;
               }else{
                    var priceDiv=document.getElementById(`${elem.asset}${elem.lastTransType}percent`)
                    priceDiv.innerText=elem.percentageDiff
               }
               if(elem.percentageDiff>5)
               {
                   var msg=new SpeechSynthesisUtterance();
                   msg.text=`HURRAY!!! ${elem.asset} ${elem.percentageDiff}%`
                   window.speechSynthesis.speak(msg);
               }
           })
        }).catch(e=>{
            console.log(e);
        })
    }
    setInterval(update_trackdata,900000);
})