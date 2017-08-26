var GOING_OFFSET = 20;
var GOING_TIMER = 80000;

$(function () {
    appender = $('.pins');
    ReworkAuction();
    ReworkActivity();
});





function ReworkActivity() {
    var listener = new Listener(GOING_TIMER)
    var popup = new Modal(
        {
            id: '#waiterModal',
            middleware: body => body.find('button').click(e => { listener.ForceAction(); popup.toggleState(); })
        }
    );

    listener.ForceStart(e => {
        if (window.WModals.signModal.isOpened()) {
            window.WModals.signModal.toggleState();
        }

        popup.toggleState();
    });
}

function ReworkAuction() {
    GET('/auction/current')
        .then(result => {          
            if (result.code == 0) {
                new Auction().LoadState(result.data)
            }
        }).catch();
}


function Auction() {
    const appender = $('.pins');
    const empty = $('.empty');
    const currentStorage = {};

    const AuctionListener = io('/auction');
    AuctionListener.on('connect', () => {
        
        AuctionListener.on('bid', bid => currentStorage[bid.uid].ForceChange(bid));

        AuctionListener.on('end', uid => {
            currentStorage[uid].ForceEnding();

            if (Object.keys(currentStorage).length == 0)
                empty.show();
        });

        AuctionListener.on('new', element => {
            empty.hide();

            if (!currentStorage[element.data.uidRecord])
                currentStorage[element.data.uidRecord] = new Item(element);
        });

        AuctionListener.on('stock', element => { console.log(element); currentStorage[element.data.uidRecord].ForceStock(element) });
    });


    this.LoadState = data => {
        if (data.length > 0)
            empty.hide();

        data.forEach(element => currentStorage[element.data.uidRecord] = new Item(element));
    }

    this.LoadNext = next => currentStorage[data.uid] = new Item(data);

    this.ForceChange = (uid, data) => currentStorage[uid].ForceChange(data);

}


function Item(object) {    
    let data = object.data;
    let name = object.name;
   
    var offsetTimeout, staticInterval, progressInterval;
    var readyDom = $(render(data,name));

    var main = {
        currentTimer: readyDom.find('.timer'),
        currentGoing: readyDom.find('.placer'),
    }

    var props = {
        currentId: data.uidRecord,
        currentProduct: data.uidProduct,
        currentButton: readyDom.find(".ui.button"),
        currentTimer: main.currentTimer.find('span'),
        currentGoing: main.currentGoing.find('span'),
        currentBid: readyDom.find('.bigger span'),
        currentName: readyDom.find('.name'),
        currentProgress: readyDom.find('.ui.progress'),
        currentDifference: new Date().getTime() - new Date(data.auctionEnds).getTime()
    }

    var doms = {
        awaiter : $(`<i class="fa fa-cog fa-spin" style=""></i>`)
    }

    if (data.currentUser == undefined) {
        props.currentTimer.text('Waiting for the first bid');
        props.currentName.text('');
        props.currentName.append(doms.awaiter);
        props.currentName.addClass('waiting');
    } else {
        LoadTimer(data, Math.abs(new Date().getTime() - new Date(data.auctionEnds).getTime()));
    }

    props.currentButton.click(event => POST('/auction/bid', { uidAuction: props.currentId }));


    this.ForceChange = data => LoadTimer(data, Math.abs(new Date().getTime() - new Date(data.ending).getTime()),true);


    this.ForceEnding = uid => readyDom.remove();


    this.ForceStock = data => {
        props.currentProgress.progress({ percent: 0 });

        clearTimeout(offsetTimeout);
        clearInterval(staticInterval);

        main.currentGoing.hide();
        main.currentTimer.show();

        props.currentBid.text(data.data.currentBid/100);
        props.currentName.text('');
        props.currentName.addClass('waiting');
        props.currentName.append(doms.awaiter);
        props.currentTimer.text('Waiting for the first bid');
    }


    function LoadTimer(data, difference, changed = false) {  
        props.currentName.removeClass('waiting');
        doms.awaiter.remove();
        
     
        let offset = difference % 1000;
        let seconds = (difference - offset) / 1000;
        let total = seconds - GOING_OFFSET;

        clearTimeout(offsetTimeout);
        clearInterval(staticInterval);

        props.currentName.transition('bounce', { silent : true ,duration : 800});

        changed ? props.currentName.text(data.name) :   props.currentName.text(object.name)
        
        
        if(changed && data.uid == window.WAuth.getData().uuid){
            props.currentName.addClass("my");
        }else{
            props.currentName.removeClass("my")
        }

        props.currentBid.text(data.currentBid / 100);

        SetDate(total, seconds, getTime(seconds - GOING_OFFSET));
        offsetTimeout = setTimeout(e => {
            seconds--;

            staticInterval = setInterval(() => {
                if (seconds == 0) {
                    clearInterval(staticInterval);
                }

                SetDate(total, seconds, getTime(seconds - GOING_OFFSET));
                seconds--;
            }, 1000)
        }, offset)
    }

    function SetTimer(json, total, seconds) {

        main.currentGoing.hide();
        main.currentTimer.show();

        props.currentProgress.progress({ percent: calculatePer(total, seconds - GOING_OFFSET) });
        props.currentTimer.text(json.minutes + ':' + (json.seconds));
    }

    function SetText(once, seconds) {
        main.currentTimer.hide();
        main.currentGoing.show();

        props.currentProgress.progress({ percent: calculatePer(10, seconds - ((once == 'once') ? 10 : 0)) });
        props.currentGoing.text(once);
    }

    function SetDate(total, seconds, data) {
        if (seconds > GOING_OFFSET) {
            SetTimer(data, total, seconds);
        } else {
            if (seconds <= GOING_OFFSET && seconds > GOING_OFFSET / 2)
                SetText('once', seconds);
            else
                SetText('twice', seconds);
        }
    }

    appender.append(readyDom);
    return this;
}





function render(data,name) {
    let currentBid = parseInt(data.currentBid) / 100;
    return `<div class="col-md-6 col-lg-4">
      <div class="product">
          <div class="product-content">          
            <div class="image">  
               <a href="/product/id${data.uidProduct}"> <img src="${data.mainImage}" alt=""> </a>
            </div>
            <div class="titile">
                ${data.product.prTitle}
            </div>
            <div class="name">
                <span>${name}</span>
            </div>
            <div class="numbers">
                <span class="price">
                    <span>RRP:</span>
                    <i class="fa fa-usd" aria-hidden="true">
                    </i>${data.product.prCost}</span>
                <span class="off">${data.offCost}% Off</span>
            </div>

            <button class="ui button blue_button">
                <div class="bigger">BID $<span>${data.currentBid / 100}</span></div>
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

function calculatePer(total, current) {
    return (current * 100) / total;
}

function getTime(seconds) {
    var minutes = Math.floor(seconds / 60);
    var second = seconds % 60

    if (!seconds) seconds = 0;
    if (!minutes) minutes = 0;

    return {
        minutes: (minutes < 10 ? '0' : '') + minutes,
        seconds: (second < 10 ? '0' : '') + second
    }
}


function waiter() {
    return $(`
     <div class="empty">
        <div class="loader"></div>
        <span> Waiting for new auction items... </span>
     </div>
    `)
}