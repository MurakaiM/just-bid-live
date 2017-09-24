window.WAuth = new AuthController();

function AuthController(){
    const socket = io.connect('/auth');
    var connectInterval;

    $('body').click(e => this.notification_bell.removeClass('opened'));
    $('#btn_signout').click( e => POST('/user/signout'));
    $('#btn_signout').popup()

    this.currentCount = 0;

    this.isSigned = false;
    this.firstLoad = false;

    this.notification_cnt = $("#cnt_notification")
    this.notification_bell = $("#btn_notification")
    this.notification_count = $("#count_notificator")

    this.notification_empty = $(".no_notification")
    this.notification_login = $(".no_login")

    this.listener = {};    
    this.userData = {};

    this.notification_bell.click( e => {    
       this.loadNotification();
       this.notification_bell.addClass('opened') 
       e.stopPropagation(); 
    })
   

    socket.on('connect', () => {
        socket.emit('status');
        socket.emit('count');    
    });

    socket.on('status', data => {      
        this.userData = data;          
        clearInterval(connectInterval); 
    });

    socket.on('exit', () => {  
        socket.close();
        this.switchAuth(false);
    });

    socket.on('disconnect', ds => (ds === "io server disconnect") ? console.log("Auth channel was dropped") : console.log("Auth channel was dicsonnected"));

    socket.on('count', count => this.countNotification(count))

    socket.on('new:notification', notification => this.newNotification(notification))

    socket.on('view:notification', id => this.reviewNotification(id))


    this.on = (trigger , fn) => this.listener[trigger] = fn;

    this.signIn = data => {  
        connectInterval = setInterval(() => { 
            socket.connect() 
        }, 150);

        this.userData.user = data;     
        this.switchAuth(true);
       
        if(this.listener['auth'])
            this.listener['auth'](this.isSigned, this.userData);

    }  

    this.loadUser = data =>{
        localStorage.setItem('')
    }

    this.forceAuth = () => socket.emit('status');


    this.forceLoad = (data,fn) => { 
        if(!data)
            return false;

        this.isSigned = true;
        this.userData = data;      
        return true;
    }

    this.switchAuth = login => {   
        this.swithNotifications(login);
        this.isSigned = login;
        
        var user = $("#user");
        var account = $("#account");
        

        if(login){           
            account.css('display','none');
            user.css('display','inline');
            user.text('Hello, '+ this.userData.user.firstName);
        }else{            
            if(window.location.pathname == '/my')
                window.location.href = '/';

            if(window.location.pathname == '/seller/mystore')
                window.location.href = '/seller/signin'

            account.css('display','inline');
            user.css('display','none');
        }
    }

    this.getData = () => this.userData;


    /*Notifications part*/

    this.loadNotification = () => {
        if(this.firstLoad) return;

        this.notification_cnt.addClass('loading');

        GET('/user/notifications/new')
            .then( result => {      
                this.drawNotification(result.data)
                this.notification_cnt.removeClass('loading')
            })
            .catch( e => {               
                if(e.code  && e.code == 10){
                    this.notification_cnt.removeClass('loading');
                    this.swithNotifications(false)
                }
            })
    }

    this.swithNotifications = isLogined => {
        if(isLogined){
            this.firstLoad = false;
            this.notification_login.hide();
            this.notification_empty.show();            
        }else{
            this.notification_cnt.find('a').remove();
            this.countNotification(0);
            this.notification_login.show();
            this.notification_empty.hide();
        }
    }

    this.countNotification = c => { 
       this.currentCount = (c!=undefined && c !=null) ? c : this.currentCount;
       this.currentCount <= 0 ? this.notification_count.text('') : this.notification_count.text(this.currentCount);
    }
    
    
    
    this.reviewNotification = id => {    
        this.notification_cnt.find(`a[data-id="${id}"]`).remove();
        this.currentCount--;      
        this.countNotification();

        if(this.currentCount == 0){
            this.notification_empty.show();
        }
    }

    this.newNotification = data  => {
        this.notification_cnt.prepend(this.createNotification(data));
        this.currentCount++;
        this.countNotification();
    }

    this.drawNotification = res => {         
        if(!this.firstLoad){
            this.firstLoad = true;
        }       
            
        if(Array.isArray(res)){
            this.notification_cnt.find('a[data-id]').remove()

            if(res.length > 0){
                this.notification_empty.hide();
            }

            res.forEach( data => this.notification_cnt.append(this.createNotification(data)) )
        }     
    }

    this.createNotification = data => {
        let payload = {
            imgUrl : '',
            action : ''
        }

        switch (data.type) {
            case 'aw':
                payload.imgUrl = 'justice'
                payload.action = '/my/winning/'
                break;
        
            default:
                imgUrl = 'price-tag-6'
                break;
        }

        return $(`
         <a class="notification" href="${payload.action+data.action}" data-id="${data.recordId}">
             <div class="image">
               <img src="/g.assets/img/commericalicons/${payload.imgUrl}.png" alt="">
             </div>
             <div class="data">
                 <div class="titles">
                   <span class="title">${ data.title }</span>
                   <span class="date">${ new Date(data.updatedAt).toLocaleDateString() }</span>
                 </div>
                 <div class="message">${ data.message }</div>
             </div>
         </a>`)
    }
}