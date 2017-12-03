$( e => init());

function init(){
    const form = new Form('reset','/user/password/reset', {
        inline : true,    
        rules : {
          email: {
            identifier: 'email',
            rules: [{
              type: 'email',
              prompt: 'Please enter valid email'
            }]
          },
          password: {
            identifier: 'password',
            rules: [{
              type: 'minLength[6]',
              prompt: 'Minimum 6 symbols'
            }]
          },
          repeated_password: {
            identifier: 'repeated_password',
            rules: [{
              type: 'match[password]',
              prompt: 'Passwords must be similar'
            }]
          }
        }
    });    
}