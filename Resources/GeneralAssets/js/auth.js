window.WAuth = new AuthController();

function AuthController(){
    const socket = io.connect('/auth');
    var connectInterval;

    this.isSigned = false;
    this.listener = {};    
    this.userData = {};

    socket.on('connect', () => {    
        socket.on('status', data => clearInterval(connectInterval));

        socket.on('exit', () => {  
            this.switchAuth(false);
            
            if(this.listener['auth'])
                this.listener['auth'](false);
        });

        socket.on('disconnect', () => {});
        socket.emit('status');
    });

    this.on = (trigger , fn) => this.listener[trigger] = fn;

    this.signIn = data => {  
        connectInterval = setInterval(() => socket.open() , 150);

        this.userData = data;     
        this.switchAuth(true);
       
        if(this.listener['auth'])
            this.listener['auth'](this.isSigned, this.userData);
    }  

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
            user.text('Hello, '+ this.userData.firstName);
        }else{
            if(window.location.pathname == '/my')
                window.location.href = '/';

            if(window.location.pathname == '/seller/mystore')
                window.location.href = '/seller/signin'

            account.css('display','inline');
            user.css('display','none');
        }
    }
}