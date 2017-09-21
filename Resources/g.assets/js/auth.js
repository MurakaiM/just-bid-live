window.WAuth = new AuthController();

function AuthController(){
    const socket = io.connect('/auth');
    var connectInterval;

    $('body').click(e => this.notification_bell.removeClass('opened'));

    this.isSigned = false;
    this.firstLoad = false;

    this.notification_bell = $("#btn_notification")
    this.notification_count = $("#count_notificator")
    this.listener = {};    
    this.userData = {};

    this.notification_bell.click( e => {    
       this.loadNotification();
       this.notification_bell.addClass('opened') 
       e.stopPropagation(); 
    })

   
    socket.on('connect', () => {    
        socket.on('status', data => { 
            this.userData = data;          
            clearInterval(connectInterval); 
        });

        socket.on('exit', () => {  
            this.switchAuth(false);
            
            if(this.listener['auth'])
                this.listener['auth'](false);
        });

        socket.on('disconnect', () => {});

        socket.on('count', count => this.countNotification(count))

        socket.emit('status');
        socket.emit('count');
    });

    this.on = (trigger , fn) => this.listener[trigger] = fn;

    this.signIn = data => {  
        connectInterval = setInterval(() => socket.open() , 150);

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

        GET('/user/notifications/new')
            .then( result => console.log(result))
            .catch( e => console.log(e))
    }

    this.countNotification = c => c <= 0 ? this.notification_count.text('') : this.notification_count.text(c);
 
    



    this.appentNotification = data => {
        return `
         <a class="notification">
             <div class="image">
               <img src="<%=domain%>/g.assets/img/commericalicons/atm-1.png" alt="">
             </div>
             <div class="data">
                 <div class="titles">
                   <span class="title">Auction winning !</span>
                   <span class="date">${ new Date(data.createdAt).toLocaleDateString() }</span>
                 </div>
                 <div class="message"> You won "iPhone" on auction ! Click to continue.</div>
             </div>
         </a>`
    }
}