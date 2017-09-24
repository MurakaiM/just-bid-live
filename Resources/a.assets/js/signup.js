var validPhone = false;
var phone, parent, wrongPrompt;
var file;

$(function () {
  setDates();
  setAvatar();
  setValidation();
});

function setValidation() {
  var validationRules = {
    inline: true,
    rules: {
      storeName :{
        identifier : 'storeName',
        rules: [{
            type: 'empty',
            prompt: 'Please enter store title'
          }]
      },  
      storeSubtitle :{
        identifier : 'storeSubtitle',
        rules: [{
            type: 'empty',
            prompt: 'Please enter store subtitle'
          }]
      },
      storeDescription : {
        identifier : 'storeDescription',
        rules: [{
            type: 'empty',
            prompt: 'Please enter store description'
        },
        {
            type: 'minLength[20]',
            prompt: 'Minimum 20 symbols'
        }
       ]
      },
      firstName: {
        identifier: 'firstName',
        rules: [{
          type: 'empty',
          prompt: 'Please enter your first name'
        }]
      },
      lastName: {
        identifier: 'lastName',
        rules: [{
          type: 'empty',
          prompt: 'Please enter your last name'
        }]
      },
      email: {
        identifier: 'email',
        rules: [{
          type: 'email',
          prompt: 'Please enter valid email'
        }]
      },
      birthday: {
        identifier: 'birthday',
        rules: [{
          type: 'empty',
          prompt: 'Please select your birth date'
        }]
      },
      phone: {
        identifier: 'phone',
        rules: [{
          type: 'phone[5]',
          prompt: 'Enter valid phone number'
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
  }

  var form = new Form("signUp", "/seller/signup", validationRules, true);
}

function setDates() {
  $("#birthday").datepicker({
    format: 'mm.dd.yyyy',
    endDate: new Date()
  });
}

function setAvatar() {
  var arr = [ 
      {
          input:  $("#fileselect1"),
          img :  $("#fileselect1").parent().find('img')
      },
      {
        input:  $("#fileselect2"),
        img :  $("#fileselect2").parent().find('img')
    }
  ]

  arr.forEach( e => e.input.on('change', event => readURL(e.input, e.img)) );
}

function readURL(input,placeholder) {

  if (input[0].files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
        placeholder.addClass('avatar');
        placeholder.attr('src', e.target.result);
    }

    reader.readAsDataURL(input[0].files[0]);
  }
}