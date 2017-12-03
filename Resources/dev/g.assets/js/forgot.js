$( e => init());

function init(){
    const form = new Form('forgot','/user/password/request', {
        inline : true,    
        rules : {
          email: {
            identifier: 'email',
            rules: [{
              type: 'email',
              prompt: 'Please enter valid email'
            }]
          }
        }
    });    
}