var GOING_OFFSET = 20;


$(function(){
    appender = $('.pins');
    ReworkAuction();
});



function ReworkAuction(){
    GET('/auction/current')
      .then( result => {
            
           if(result.code == 0){
              new Auction().LoadState(result.data) 
           }else{

           }       
           
      })
      .catch();
}


function Auction(){
    const appender = $('.pins');
    const currentStorage = {};

    const AuctionListener = io('/auction');
    AuctionListener.on('connect', () => {
         
        AuctionListener.on('bid', bid => currentStorage[bid.uid].ForceChange(bid) );

        AuctionListener.on('end', uid => currentStorage[uid].ForceEnding() );

        AuctionListener.on('new', bid => currentStorage[bid[0]] = new Item( bid[1]) );

        AuctionListener.on('stock', bid => currentStorage[bid[0]].ForceStock( bid[1] ));
    });
   

    this.LoadState = ( data ) => data.forEach(element => currentStorage[element[0]] = new Item(element[1]) );
    
    this.LoadNext = (next) => currentStorage[data.uid] = new Item(data);

    this.ForceChange = (uid,data) => currentStorage[uid].ForceChange(data);

    function startListening(){

    }
}
    

function Item(data){
    var offsetTimeout, staticInterval;
   
    var readyDom = $(render(data));
    var main = {
        currentTimer : readyDom.find('.timer'),
        currentGoing : readyDom.find('.placer'),
    }
    var props = {
        currentId : data.uidRecord,
        currentProduct :  data.uidProduct,
        currentButton :  readyDom.find(".ui.button"),
        currentTimer : main.currentTimer.find('span'),
        currentGoing : main.currentGoing.find('span'),
        currentBid : readyDom.find('.bigger span'),
        currentName : readyDom.find('.name'),
        currentProgress : readyDom.find('.ui.progress'),
        currentDifference :  new Date().getTime() - new Date(data.auctionEnds).getTime()
    }
       
    
    if(data.currentUser == undefined) {
        props.currentTimer.text('Waiting for the first bid');
    }else{
        LoadTimer(data, Math.abs( new Date().getTime() - new Date(data.auctionEnds).getTime() ));
    }
   
    props.currentButton.click( event => POST('/auction/bid', { uidAuction : props.currentId }));

    this.ForceChange = data =>  LoadTimer(data, Math.abs( new Date().getTime() - new Date(data.ending).getTime() ));
            
    
    this.ForceEnding = uid => readyDom.remove();

   
    this.ForceStock = data =>  {  
        props.currentProgress.progress({ percent: 0 });

        clearTimeout(offsetTimeout);
        clearInterval(staticInterval);

        main.currentGoing.hide();
        main.currentTimer.show();   
             
       props.currentTimer.text('Waiting for the first bid');    
    }

   
    function LoadTimer(data,difference){   
        var offset = difference % 1000;
        var seconds = (difference - offset) / 1000;
        var total = seconds - GOING_OFFSET;
        
        clearTimeout(offsetTimeout);
        clearInterval(staticInterval);

        offsetTimeout = setTimeout( e => {   
            props.currentName.transition('bounce');
            props.currentBid.text(data.price);
            props.currentName.text(data.name);
            
            SetDate(total,seconds,getTime(seconds - GOING_OFFSET));
            seconds--;     

            staticInterval = setInterval( () => {
                if(seconds==0) {
                    clearInterval(staticInterval);
                } 
                
                SetDate(total,seconds,getTime(seconds - GOING_OFFSET));            
                seconds--; 
            }, 1000 )
        }, offset)
    }

    function SetTimer(json,total,seconds){
        
        main.currentGoing.hide();
        main.currentTimer.show();

        props.currentProgress.progress({ percent: calculatePer(total,seconds - GOING_OFFSET) });
        props.currentTimer.text(json.minutes+':'+( json.seconds ));
    }

    function SetText(once,seconds){
        main.currentTimer.hide();
        main.currentGoing.show();

        props.currentProgress.progress({ percent: calculatePer(10,seconds - ((once == 'once') ? 10 : 0 )) });
        props.currentGoing.text(once);
    }

    function SetDate(total,seconds,data){
        if(seconds > GOING_OFFSET){
            SetTimer(data,total,seconds);  
        }else{
            if(seconds <= GOING_OFFSET && seconds > GOING_OFFSET/2 )
                SetText('once',seconds);
            else
                SetText('twice',seconds);                          
        }
    }

    appender.append(readyDom);
    return this;
}




function render(data){   
    return `<div class="col-md-6 col-lg-4">
        <div class="product">
          <div class="product-content">          
            <div class="image">  <img src="${data.mainImage}" alt=""> </div>
            <div class="titile">
                ${data.product.prTitle}
            </div>
            <div class="name">
                Adam is Winning
            </div>
            <div class="numbers">
                <span class="price">
                    <span>RRP:</span>
                    <i class="fa fa-usd" aria-hidden="true">
                    </i>${data.product.prCost}</span>
                <span class="off">${data.offCost}% Off</span>
            </div>

            <button class="ui button blue_button">
                <div class="bigger">BID $<span>${data.currentBid}</span></div>
                <div class="smaller">+$${data.offShipment} Shipping</div>
            </button>

            <div class="going">
                <div class="timer">
                    <i class="fa fa-clock-o" aria-hidden="true"></i>
                    <span> 0:00</span>
                </div>
                <div class="placer" style="display:none;">
                    Going <span>once</span>
                    <img src="../UserAssets/img/justice.png">
                </div>
            </div>
            <div class="ui indicating tiny progress">
                <div class="bar"></div>        
            </div>
          </div>
       </div>`;
}

function calculatePer(total,current){
    return (current * 100) / total;
}

function getTime(seconds){
    var minutes  = Math.floor( seconds/60 );
    var second = seconds % 60

    if(!seconds) seconds = 0;
    if(!minutes) minutes = 0;

    return {
        minutes : (minutes < 10 ? '0' : '')+minutes,
        seconds : (second < 10 ? '0' : '') + second
    }
}
