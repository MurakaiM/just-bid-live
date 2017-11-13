$(e =>  $('tr').each((i,e) => new Approval($(e))))


function Approval(object){
    this.dom = object;
    this.id = object.data('id');
  
    this.approved = this.dom.find('.approve');
    this.declined = this.dom.find('.decline')

    this.approved.click( e => this.sendRequest(true));    
    this.declined.click( e => this.sendRequest(false));


    this.setLoading = () => {
        this.approved.addClass('loading');
        this.declined.addClass('loading');
    }

    this.sendRequest = bl => {
        this.setLoading();     
        POST('/admin/ab/product/approval', { id : this.id, allowed : bl })
            .then( answer => this.dom.remove())
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


