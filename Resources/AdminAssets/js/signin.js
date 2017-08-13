$( e => setValidation());

function setValidation() {
  let validationRules = {
    notSuccess : true,
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
          type: 'empty',
          prompt: 'Please enter password'
        }]
      }
    },
    on : 'submit',
    success : user => {   
      window.WAuth.signIn(user);
      window.location.href = '/seller/mystore';
    },    
    failure : err => {}
  }

  var form = new Form("sellerIn", "/user/signin", validationRules);
}

