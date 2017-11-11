var validPhone = false;
var phone, parent, wrongPrompt;
var file;

$(function () {
  setDates();
  setAvatar();
  setValidation();

  $('.ui.dropdown').dropdown();
});

function setValidation() {
  var validationRules = {
    inline: true,
    finishing : true,
    rules: {
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
      fphone: {
        identifier: 'fphone',
        rules: [{
          type: 'empty',
          prompt: 'Please select your country cody'
        }]
      },
      lphone: {
        identifier: 'lphone',
        rules: [{
          type: 'empty',
          prompt: 'Please enter rest part of phone number'
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

  var form = new Form("signUp", "/user/signup", validationRules, true);
}

function setDates() {  
  $("#birthday").datepicker({
    format: 'mm.dd.yyyy',
    endDate: new Date(),
    startDate: new Date("01.01.1900")
  });
}

function setAvatar() {
  fileselect = $("#fileselect");
  fileselect.on('change', () => {  
    $('.ui.image').addClass('avatar');
    readURL(fileselect)
  });
}

function readURL(input) { 
  if (input[0].files[0]) {
    var reader = new FileReader(); 
    reader.onload = function (e) {
      $('.ui.avatar').attr('src', e.target.result);
    }

    reader.readAsDataURL(input[0].files[0]);
  }
}