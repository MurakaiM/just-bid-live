var GOING_OFFSET = 20;
var GOING_TIMER = 80000;
var HOLDUP_POPUP = undefined;

$(function () {
    $('.list_item').tab();
    
    new Nag('usd_nag', { key : 'usd_nag' });
    new Nag('cookie_nag', { key : 'cookie_nag' });

    ReworkAuction();
    ReworkActivity();
});


function ReworkActivity() {
    var listener = new Listener(GOING_TIMER)
    var popup = new Modal({
        id: '#waiterModal',
        middleware: body => body.find('button').click(e => { listener.ForceAction(); popup.toggleState(); })
    });

    listener.ForceStart(e => {
        if (window.WModals.signModal.isOpened()) {
            window.WModals.signModal.toggleState();
        }

        popup.toggleState();
    });

    HOLDUP_POPUP = new Modal({
        id: '#errorModal',
        middleware: body => body.find('button').click(e => HOLDUP_POPUP.toggleState())
    })
}

function ReworkAuction() {
    GET('/auction/current')
        .then(result => {          
            if (result.code == 0) {
                new Auction().load(result.data)
            }
        }).catch();
}



function Auction() {
    this.appender = $('.pins');
    this.empty = $('.empty');
    this.storage = {};


    const AuctionListener = io('/auction');
    
    AuctionListener.on('connect', () => console.log('connection established'));

    AuctionListener.on('disconnect', disconnect => AuctionListener.connect())
    

    AuctionListener.on('inactive', incoming => {
        if(incoming.type == 'featured' || incoming.type == 'reserved'){
            this.storage[incoming.type].inactiveItem(incoming)
        }

        this.storage[incoming.category].inactiveItem(incoming)
    });

    AuctionListener.on('bid', incoming => {       
        if(incoming.type == 'featured' || incoming.type == 'reserved'){
            this.storage[incoming.type].changeItem(incoming)
        }

        this.storage[incoming.category].changeItem(incoming)
    });

    AuctionListener.on('end', incoming => {
        if(incoming.type == 'featured' || incoming.type == 'reserved'){
            this.storage[incoming.type].soldItem(incoming)
        }

        this.storage[incoming.category].soldItem(incoming)
    });

    AuctionListener.on('new', incoming => {   
        if(incoming.type == 'featured' || incoming.type == 'reserved'){
            this.storage[incoming.type].addItem(incoming)
        }

        this.storage[incoming.category].addItem(incoming)
    });


    this.load = data => {        
        data.forEach(elem => {
            if(elem.type == 'featured' || elem.type == 'reserved'){
                this.storage[elem.type].addItem(elem)
            }

            this.storage[elem.category].addItem(elem)
        });
    }

    this.push = item => {   
        this.storage[item.id] = item;
    }    

    $('.auction_block').each( (i,elem) => this.push(new ItemController(elem)))
}


function ItemController(dom){
    this.items = {};
    this.freeSolts = [];

    this.dom = $(dom);
    this.empty = this.dom.find('.empty')
    this.id = this.dom.data('tab');
    
    
    this.addItem = payload => {
        if(this.freeSolts.length > 0){
            let freeItem = this.freeSolts.shift();

            this.items[payload.id] = freeItem;
            this.items[payload.id].ForceNew(payload);
            return
        }

        var item = new Item(payload)            
        this.items[payload.id] = item;

        if(Object.keys(this.items).length > 0){
            this.empty.hide()
        }
    
        this.dom.append(item.dom)    
    }

    this.changeItem = payload => {
        this.items[payload.id].ForceChange(payload)
    }

    this.soldItem = payload => {
        var sold = this.items[payload.id];
        sold.ForceEnding(payload);
        
        delete this.items[payload.id];

        setTimeout(e => {
            sold.ForceNext(payload)
            this.freeSolts.push(sold)             
        }, 2000)
    }

    this.inactiveItem = payload => {
        var sold = this.items[payload.id];   
        delete this.items[payload.id];
       
        sold.ForceNext(payload)
        this.freeSolts.push(sold)  
    }
}


function Item(payload){
    this.data = payload;
    this.dom = $(getRender(this.data))

   
    this.intervals =  {
        offset : undefined,
        static : undefined,
        progress : undefined
    }
    this.timers = {
        static : this.dom.find('.timer'),
        going : this.dom.find('.placer')
    }
    this.subdoms = {      
        button: this.dom.find(".ui.button"),
        static: this.timers.static.find('span'),
        going: this.timers.going.find('span'),       
        
        name: this.dom.find('.name'),
        progress: this.dom.find('.ui.progress'),
        product : this.dom.find('.product.auction'),

        img : this.dom.find('a img'),
        href : this.dom.find('a'),
        title : this.dom.find('.title'),
        rrp : this.dom.find('.rrpcost'),
        bid: this.dom.find('.bigger span'),
        shipment : this.dom.find('.smaller span')
    }
    this.helpful = {       
        awaiter : $(`<i class="fa fa-cog fa-spin" style=""></i>`)
    }


    this.LoadTimer = (incoming, changed = false) => {        
        this.subdoms.name.removeClass('waiting');
        this.helpful.awaiter.remove();
        
        let difference = Math.abs(new Date(incoming.start).getTime() - new Date(incoming.end).getTime())
        let offset = difference % 1000
        let seconds = (difference - offset) / 1000
        let total = seconds - GOING_OFFSET

        clearTimeout(this.intervals.offset);
        clearInterval(this.intervals.static);

        if(window.WAuth.getData().user){
            (incoming.user == window.WAuth.getData().user.uid) ? this.subdoms.name.addClass('my') : this.subdoms.name.removeClass('my')
        }

        this.subdoms.name.transition('bounce', { silent : true, duration : 800 })
        this.subdoms.name.text(incoming.name) 
        this.subdoms.bid.text(incoming.bid / 100)
             
        
        this.SetDate(total, seconds, getTime(seconds - GOING_OFFSET));

        this.intervals.offset = setTimeout(e => {
            seconds--;

            this.intervals.static = setInterval(() => {
                if (seconds == 0) {
                    clearInterval(this.intervals.static);
                }

                this.SetDate(total, seconds, getTime(seconds - GOING_OFFSET));
                seconds--;
            }, 1000)
        }, offset)
    }

    this.LoadWaiting = (incoming) => {              
        let difference = Math.abs(new Date().getTime() - new Date(incoming.end).getTime())
        let offset = difference % 1000
        let seconds = (difference - offset) / 1000
        let total = seconds + GOING_OFFSET;

        clearTimeout(this.intervals.offset);
        clearInterval(this.intervals.static);               
        
        this.SetDate(total, seconds, getTime(seconds), true);
        this.intervals.offset = setTimeout(e => {
            seconds--;

            this.intervals.static = setInterval(() => {
                if (seconds == 0) {
                    clearInterval(this.intervals.static);
                }

                this.SetDate(total, seconds, getTime(seconds), true);
                seconds--;
            }, 1000)
        }, offset)
    }

    this.SetTimer = (json, total, seconds, waiter) => {
        this.timers.going.hide();
        this.timers.static.show();

        if(!waiter)
            this.subdoms.progress.progress({ percent: getPercent(total, seconds - GOING_OFFSET ) });

        this.subdoms.static.text(json.minutes + ':' + (json.seconds));
    }

    this.SetText = (once, seconds) => {
        this.timers.static.hide();
        this.timers.going.show();

        this.subdoms.progress.progress({ percent: getPercent(10, seconds - ((once == 'once') ? 10 : 0) )});
        this.subdoms.going.text(once);
    }

    this.SetDate = (total, seconds, data, waiter = false) => {
        if(waiter){
            this.SetTimer(data, total, seconds, waiter);
            return;
        }


        if (seconds > GOING_OFFSET) {
            this.SetTimer(data, total, seconds, waiter);
        } else {
            if (seconds <= GOING_OFFSET && seconds > GOING_OFFSET / 2)
                this.SetText('once', seconds);
            else
                this.SetText('twice', seconds);
        }
    }



    this.ForceNew = data => {
        this.data = data;

        this.subdoms.img.attr('src', this.data.img);
        this.subdoms.href.attr('href',`/product/id${this.data.product}`) 
        this.subdoms.title.text(this.data.text)
        this.subdoms.rrp.text(this.data.cost)
        this.subdoms.bid.text(this.data.bid/100)
        this.subdoms.shipment.text(this.data.shipment)
        
        this.subdoms.product.addClass(getType(data.type))
        
        this.subdoms.static.text('Waiting for the first bid');
        this.timers.static.show();
        this.timers.going.hide()

        this.subdoms.name.removeClass('my')
        this.subdoms.name.text('');
        this.subdoms.name.append(this.helpful.awaiter);
        this.subdoms.name.addClass('waiting');

        this.subdoms.product.removeClass('loading')       
        this.LoadWaiting(data) 
        return;
    }
    
    this.ForceChange = data => this.LoadTimer(data, true);
        

    this.ForceEnding = () =>  {
        this.subdoms.product.addClass('sold')
        this.subdoms.going.text('last');
    }

    this.ForceNext = () => {        
        this.subdoms.product.addClass('loading')
        this.subdoms.product.removeClass('sold purple orange pink reserved')
    }


    this.construct = () => {        
        if (this.data.user == undefined) {
            this.subdoms.static.text('Waiting for the first bid');
            this.subdoms.name.text('');
            this.subdoms.name.append(this.helpful.awaiter);
            this.subdoms.name.addClass('waiting');
            this.LoadWaiting(this.data);
        } else {
            this.LoadTimer(this.data, false);
        }

        this.subdoms.button.click(event => {                  
            POST('/auction/bid', { id: this.data.id })
               .then( result => console.log(result))
               .catch( e =>  e.code == 11 ? HOLDUP_POPUP.toggleState() : window.WModals.signModal.toggleState())             
        });
    }

    this.construct();

    return this;
}


function getType(type){
    var borderColor = '';
    switch (type) {
        case 'featured':
            borderColor = 'purple'
            break;

        case 'small':
            borderColor = 'orange'
            break;

        case 'big':
            borderColor = 'pink'
            break;
        case 'reserved':
            borderColor = 'reserved'
            break;

        default:
            borderColor = '';
            break;
    }
    return borderColor;
}


function getRender(data) {   
    return `<div class="col-md-6 col-lg-4">
      <div class="product auction ${getType(data.type)}">
          <div class="product-content">          
            <div class="image">  
               <a href="/product/id${data.product}"> <img src="${data.img}" alt=""> </a>
            </div>
            <div class="title">
                ${data.title}
            </div>
            <div class="name">
                <span>${data.name}</span>
            </div>
            <div class="numbers">
                <span class="price">
                    <span>RRP:</span>
                        <i class="fa fa-usd" aria-hidden="true"></i>
                        <span class="rrpcost">${data.cost}</span>
                </span>               
            </div>

            <button class="ui button blue_button">
                <div class="bigger">BID $<span>${data.bid / 100}</span></div>
                <div class="smaller">+$<span>${data.shipment}</span> Shipping</div>
            </button>       
            
            <div class="goingfooter">
                <div class="ui indicating tiny progress">
                    <div class="bar"></div>        
                </div>

                <div class="going">               
                    <div class="timer">
                        <i class="fa fa-clock-o" aria-hidden="true"></i>
                        <span> 0:00</span>
                    </div>
                    <div class="placer" style="display:none;">
                        Going <span>once</span>
                        <img src="/prod/u.assets/img/justice.png">
                    </div>
                </div>
            </div>
          </div>
     </div>`;
}

function getPercent(total, current) {
    return (current * 100) / total;
}

function getDifference(ending){
    return Math.abs(new Date().getTime() - new Date(ending).getTime())
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
