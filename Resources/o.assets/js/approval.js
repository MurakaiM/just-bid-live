$(e =>  $('tr').each((i,e) => Approval($(e))))


function Approval(object){

    let id = object.data('id');
    console.log(id)

    let approved = object.find('.approve');
    let declined = object.find('.decline')

    approved.click( e => this.sendRequest(true));
    
    declined.click( e => this.sendRequest(false));


    this.setLoading = () => {
        approved.addClass('loading');
        declined.addClass('loading');
    }

    this.sendRequest = bl => {
        this.setLoading();
     
        POST('/admin/ab/product/approval', { id, allowed : bl })
            .then( answer => object.remove())
            .catch( error => console.log(error))
    }

    return this;
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


