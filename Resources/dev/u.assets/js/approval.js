var validPhone = false;
var phone, parent, wrongPrompt;
var fileselect;

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
      }      
    },
    success : (data, form) => setTimeout(e => window.location.href='/' ,3500),
    failure : (data, form) => console.log(data)    
  }

  var form = new Form("signUp", "/user/signing/social/approval", validationRules, true);
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
    fileselect.addClass('avatar');
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