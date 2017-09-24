window.WProps = new Props();
window.WStorage = new Storage();

window.WProps.mobilePhone();
window.WProps.currency();
window.WModals = {};

$(e => setUpSignSystem());



function setUpSignSystem() {
  window.WModals.signModal = new Modal({ id :'#signModal' }, true);
  SignIn(window.WModals.signModal);

  $("#account").click(e => window.WModals.signModal.toggleState());
}


function createPrompt(text) {
  return $(`<div class="ui basic red pointing prompt label transition visible">${text}</div>`);
}


function Form(id, url, validationRules, ...args) {
  var isSubmited = false;
  var $form = (id instanceof jQuery) ? id : $("#" + id);
  var delay = ( validationRules.delay !== undefined || validationRules.delay != null)  ? validationRules.delay : 1000;

  var $messages = {
    success: $form.find(".success p"),
    error: $form.find(".error p")
  };

  validationRules.on = (validationRules.on) ? validationRules.on : 'blur';

  $form.form({
    fields: validationRules.rules,
    inline: validationRules.inline,
    on: validationRules.on
  });

  $form.submit(e => {    
    if(isSubmited)
        return false;

    e.preventDefault();
    isSubmited = true;
    postThis(url);
    return false;
  });

  this.setError = setError;
  this.setLoading = setLoading;
  this.setSuccess = setSuccess;

  this.addField = (rule) => { 
    validationRules.rules[rule.identifier] = rule; 
    $form.form({ 
      fields: validationRules.rules,
      inline: validationRules.inline,
      on: validationRules.on 
    }); 
  }; 
  
  this.removeField = id => {
    delete validationRules.rules[id];
    $form.form({ 
      fields: validationRules.rules,
      inline: validationRules.inline,
      on: validationRules.on
    }); 
  }


  function setLoading() {
    $form.removeClass('overall error success');
    
    if(validationRules.justbutton){
      $form.find('button:submit').addClass('loading');
      return;
    }

    $form.addClass('loading');   
  }

  function setError(value) {   
    $messages.error.text(value);
    $form.removeClass('loading success');
    $form.addClass('overall error');
  }

  function setSuccess() {
    if(validationRules.reset == false){
      $form.form('reset');
    }

    $form.removeClass('loading error');
    $form.addClass('overall success');
  }

  function getVelues() {
    return getFormData();
  }



  function postThis(url) {
    var data = args[0] == true ? new FormData($form[0]) : getFormData();
    
    if(validationRules.dataMiddleware){
      data = validationRules.dataMiddleware(data);
    }


    if ($form.form('is valid')) {      
      setLoading();
      setTimeout(() => {
        postForm(url, data, args[0] == true ? true : false)
          .then(data => {   
            if(validationRules.justbutton){
              $form.find('button:submit').removeClass('loading');
            }
            
            if (data.code >= 10) {
              if(validationRules.failure)
                validationRules.failure(data.data,$form);
             
              setError(data.message);
            } else {            
              if(validationRules.success)
                validationRules.success(data.data,$form);

              if(validationRules.notSuccess == true)
                return;

              setSuccess();
            }
            
            isSubmited = false;
          })
          .catch(err => { isSubmited = false; setError(err.message); });
      }, delay);
    }else{
      isSubmited = false;
    }
  }

  function getFormData() {
    return $form.form('get values');
  }
  
}

function Storage(){
  this.callbacks = [];

  this.subscribe = fn => {
    callbacks.push(fn);
  };
    
  this.setItem = (id,item) =>  {
    this.callbacks.forEach( fn => fn(id,item) );
    localStorage.setItem(id, item);
  }

  this.getItem = id => localStorage.getItem(id)
}



function postForm(url, data, isMultipart) {
  return new Promise((resolve, reject) => {   
    if (isMultipart) {
      backendPostForm(url, data, (err, answer) => {      
        if (err) {
          reject("Request failed");
        } else if (answer.code == 404) {
          reject(answer.message);
        } else {
          resolve(answer);
        }
      });
    } else {
      backendPost(url, data, (err, answer) => {        
        if (err) {
          reject("Request failed");
        } else if (answer.code == 404) {
          reject(answer.message);
        } else {
          resolve(answer);
        }
      });
    }
  });
}



function backendPost(url, data, callback) {
  $.ajax({
    url: url,
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(data),
    success: function (data) {

      callback(null, data);
    },
    error: function () {
      callback(new Error("Ajax Failed"));
    }
  })
}

function backendPostForm(url, data, callback) {
  $.ajax({
    url: url,
    type: 'POST',
    data: data,
    async: true,
    success: function (data) {

      callback(null, data);
    },
    error: function () {
      callback(new Error("Ajax Failed"));
    },
    xhr: function () {
      var xhr = new window.XMLHttpRequest();
      xhr.upload.addEventListener("progress", function (evt) {
        if (evt.lengthComputable) {
          var percentComplete = evt.loaded / evt.total;
          percentComplete = parseInt(percentComplete * 100);
        }
      }, false);
      return xhr;
    },
    cache: false,
    contentType: false,
    processData: false
  });
}

function backendGet(url, callback) {
  $.ajax({
    url: url,
    type: 'GET',
    success: function (data) {
      callback(null, data);
    },
    error: function () {
      callback(new Error("Ajax Failed"));
    }
  })
}



function GET(url) {
  return new Promise((resolve, reject) => {
    backendGet(url, (err, result) => {
      if (err) {
        return reject(10);
      } else if (result.code >= 10 && result.code < 20) {
        return reject(result);
      }

      return resolve(result);

    });
  });
}

function POST(url, json) {
  return new Promise((resolve, reject) => {
    backendPost(url, json, (err, result) => {
      if (err) {
        return reject(10);
      } else if (result.code >= 10 && result.code < 20) {
        return reject(result);
      }

      return resolve(result);

    });
  });
}




function mobileDeviceInit() {
  var isMobileDevice = false;

  if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) ||
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4)))
    isMobileDevice = true;

  return isMobileDevice;
}

function Props() {
  this.isMobile = mobileDeviceInit();

  this.isDynamicMobile = () => mobileDeviceInit();


  this.disableResize = () => {
    var size = [window.width, window.height];

    $(window).resize(function () {
      window.resizeTo(size[0], size[1]);
    });
  }

  this.mobilePhone = () => {
    $.fn.form.settings.rules.phone = (value, params) => {
      var validValue = new libphonenumber.asYouType().input(value);
      var parsedValue = new libphonenumber.parse(validValue);

      if (Object.keys(parsedValue).length >= 2)
        return true;
      else
        return false;
    }
  }

  this.currency = () => {
    $.fn.form.settings.rules.currency = (value, params) => {
      const reg =   /^\d+([.]\d{1,2})?$/;
      return reg.test(value);      
    }

    $.fn.form.settings.rules.shipment = (value, params) => {
      const reg =   /^\d+([.]\d{1,2})?$/;
      
      if(!reg.test(value))
          return false;

      let float = parseFloat(value);
      if(float < 0 || float > 20)
        return false;
      else 
        return true;
    }

  }

  return this;
}



function Modal(options, formable = false) {
  var overlay = $(options.id);
  var body = overlay.find('.body');
  var window = $('body');
  var props = {};
  var disabledToggle = false;
 
  if(formable)
    var form = body.find('form');

  overlay.click(e => {
    if(!options.closable){
      this.toggleState();
    }   
  });
  body.click(e => e.stopPropagation());

  if(options.closer){
      body.find(options.closer).click( e => this.toggleState());
  }

  this.opened = false;

  if(options.middleware)
    options.middleware(body,props,this);

  this.toggleState = () => {
    if(disabledToggle) 
      return;

    if(formable){
      if(!this.opened){
        form.form('reset');        
        form.removeClass('error success');
      }  
    }

    if(!this.opened){
      if(options.onOpen){
        options.onOpen(body,props,this);
      }
    }else{
      if(options.onOpen){
        options.onClose(body,props,this);
      }
    }

    overlay.toggleClass('opened');
    this.opened = !this.opened;

    if(options.overflowed){
      if(this.opened)
        window.css('overflow','hidden');
      else
        window.css('overflow','auto');
    }
  } 
  this.getBody = () => body;

  this.toggleDisabling = () => disabledToggle = !disabledToggle;

  this.isOpened = e => overlay.hasClass('opened');
}

function SignIn(modal) {
  var form = new Form(modal.getBody().find('form'), '/user/signin', {
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
      modal.toggleState();
      window.WAuth.signIn(user);
    },
    failure : err => {}
  });

}