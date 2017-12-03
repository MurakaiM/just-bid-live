
function Activity(timer){
    this.waiter = timer;    
    this.fn;
    this.timeout;

    this.Start = e =>  this.timeout = setTimeout( e => this.onEnd(),  this.waiter)

    this.onEnd = e => this.fn();    

    this.SetFn = fn => this.fn = fn;

    this.dispatchDelay = e => {
        clearTimeout(this.timeout)
        this.Start();
    }

    return this;
}

function Listener(timer){
    this.Activity = new Activity(timer);


    $(window).on( "keypress click", e => this.Activity.dispatchDelay() );

    this.ForceStart = fn => {
        this.Activity.SetFn(fn);
        this.Activity.Start();
        
        $(window).on( "keypress click", e => this.Activity.dispatchDelay() );        
    }
    
    this.ForceAction = e => this.Activity.dispatchDelay(); 

    return this;
}