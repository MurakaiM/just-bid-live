$(function () {

  $('select.dropdown').dropdown();

  contactForm();
});


function contactForm() {
  var validationRules =
  {
    firstName: {
        identifier  : 'firstName',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please enter your first name'
          }
        ]
    },
    lastName: {
        identifier  : 'lastName',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please enter your last name'
          }
        ]
    },
    email: {
        identifier  : 'email',
        rules: [
          {
            type   : 'email',
            prompt : 'Please enter valid email'
          }
        ]
    },
    question: {
        identifier  : 'question',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please select a type of your message/question'
          }
        ]
    },
    message: {
        identifier  : 'message',
        rules: [
          {
            type   : 'minLength[20]',
            prompt : 'Your message/question is too short'
          }
        ]
    }

  }


  new Form("contactForm","/rr", validationRules);
}
