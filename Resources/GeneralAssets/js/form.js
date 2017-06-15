function Form(id, url, validationRules) {
  var $form = $("#"+id);

  $form.form({
      fields : validationRules,
      inline : true,
      on     : 'blur'
    });

  $form.submit(() => {
      postThis(url);
      return false;
  });

  this.setError = setError;
  this.setLoading = setLoading;
  this.setSuccess = setSuccess;


  function setLoading(){
    $form.removeClass('error');
    $form.removeClass('success');
    $form.addClass('loading');
  }

  function setError(){
    $form.removeClass('loading');
    $form.removeClass('success');
    $form.addClass('error');
  }

  function setSuccess(){
    $form.removeClass('loading');
    $form.removeClass('error');
    $form.addClass('success');
  }

  function getVelues(){
    return getFormData();
  }


  function postThis(url){

    if($form.form('is valid')){
      $form.addClass('loading');

      setTimeout(() => {
        postForm(url,getFormData())
          .then( data => setSuccess())
          .catch( err => setError());
      }, 1500);

    }

  }

  function getFormData(){
    return $form.form('get values');
  }
}

function postForm(url,data){
    return new Promise((resolve, reject) => {
        backendPost(url, data, (err,data) => {
            if(err){
              reject("Ajax errpor");
            } else if(data.code == 404){
              reject(data.message);
            } else{
              resolve(data);
            }
        });
    });
}

function backendPost(url, data, callback) {
    $.ajax({
        url:  url,
        type: 'POST',
        contentType : 'application/json',
        data: JSON.stringify(data),
        success: function(data){

            callback(null, data);
        },
        error: function() {
            callback(new Error("Ajax Failed"));
        }
    })
}

function backendGet(url, callback) {
    $.ajax({
        url:  url,
        type: 'GET',
        success: function(data){
            callback(null, data);
        },
        error: function() {
            callback(new Error("Ajax Failed"));
        }
    })
}
