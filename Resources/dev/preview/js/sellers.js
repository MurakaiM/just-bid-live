$( e => onLoad())

function onLoad(){

    var validationRules = {        
          email: {
            identifier: 'cm-ztdulk-ztdulk',
            rules: [{
              type: 'emailer',
              prompt: 'Please enter valid email'
            }]
          },        
    }
    
    $('.ui.embed').embed();

    const FORM = $("#subForm");
    FORM.form({
        on: "change",
        fields : validationRules
    });
    FORM.submit( () => {
        if(!FORM.form('is valid'))
            return false;

        FORM.toggleClass('loading');
        setTimeout( () => {
            POST('https://justbidlive.createsend.com/t/j/s/ztdulk/',FORM)
                .then(data => { FORM.toggleClass('loading'); window.location.href="/success"; })
                .catch(error => { FORM.toggleClass('loading'); })

        }, 1000);
        return false;
    });

}



//https://justbidlive.createsend.com/t/j/s/ztdulk/



$.fn.form.settings.rules.emailer = (value, params) => {
    var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return reg.test(value);
}

function POST(url, form) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            type: 'POST',            
            data: form.serialize(),
            success: function (data) {        
              resolve(data);
            },
            error: function () {
                reject(new Error("Ajax Failed"));
            }
        });
    });
  }
  