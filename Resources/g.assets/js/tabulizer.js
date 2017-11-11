/* Tabulation component */
function Tabs(options, ajax){
    this.currentTab = null;
    this.currentId = null;
    this.currentHead = null;

    this.headers = {};
    this.contents = {}; 

    var reworkHeader = element => {
        var dom = $(element);
        var data = dom.data('tab');
        
    
        if(dom.hasClass('disabled'))
            return;
        
        this.headers[data] = dom;
        
        dom.click( e => this.openTab(data))
    }
    
    var reworkContent = element => {
        var dom = $(element);
        var data = dom.data('tab');
        
        this.contents[data] = dom;       
    }

    this.openTab = id => { 
        if(id == this.currentId){
            return;
        }

        window.location.href = '#/'+id;

        if(this.currentId &&  ajax[this.currentId]){
            ajax[this.currentId].onClose(this.currentHead, this.currentTab);
        }
      
        if(this.currentHead)
            this.currentHead.toggleClass('active');

        this.currentHead = this.headers[id];
        this.currentHead.toggleClass('active');


        if(this.currentTab)
            this.currentTab.toggleClass('active');

        this.currentTab = this.contents[id];
        this.currentId = id;

        this.currentTab.toggleClass('active');


        if(ajax[id]){
            ajax[id].onOpen(this.currentHead, this.currentTab);
        }

    }    

    this.preload = (head,body) => {
        this.currentHead = head;
        this.currentTab = body;

        this.currentHead.addClass('active');
        this.currentTab.addClass('active');
        
        this.currentId = body.data('tab');
        if(ajax[this.currentId]){
            ajax[this.currentId].onOpen(this.currentHead, this.currentTab);
        }

    }

    this.openHashTab = hash => {
        this.openTab(hash.replace('#/',''))
    }


    $(options.headers).find('a[data-tab]').each( (i,element) => reworkHeader(element));
    $(options.contents).find('.segment.tab[data-tab]').each( (i,element) => reworkContent(element));

    var hashed = window.location.hash.replace('#/','');
    hashed = hashed ? hashed : 'home';

    this.preload( 
        $(options.headers).find(`a[data-tab="${hashed}"]`),
        $(options.contents).find(`.segment.tab[data-tab="${hashed}"]`)
    );
}

/* Promise */
function LoadSegment( url, header, element ){
    if(!element.hasClass('loading'))
        element.addClass('loading');

    return new Promise((resolve,reject) =>{ 
                 
            GET(url).then(result => resolve({
                result : result,
                segment : element,
                header : header
            })).catch( error => reject({
                result : error,
                segment : element,
                header : header
            }));
        
    });
}