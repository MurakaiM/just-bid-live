$(function(){
    $('#productsDrop').dropdown();
    setTable();
});


function setTable(){    
    var tableQuestions = new Table('questions', {
        defaultSort: 'createdAt',
        search: "#questionsSearch",
        forPage: "#questionsDrop",
        buttons: {
          previous: ".left.icon.item",
          next: ".right.icon.item",
          to: ".ui.button.radiusless.borderless"
        },
        input: {
          to: ".ui.left.action input"
        },
        row: item => {
          return $(` 
            <tr>
              <td>${item.contactor}</td> 
              <td>${item.email}</td>      
              <td class="max-td">${item.message}</td>   
              <td>${getType(item.type)}</td>      
              <td>${new Date(item.createdAt).toLocaleDateString()}</td>    
            </tr>
          `)
        },
        click: (i, obj, arr) => {  
          currentItem = {
            i,
            obj,
            arr
          }
        },
        onFocusLost: () => {    
          currentItem = null;
        }
    });

    tableQuestions.loadInRaw('/admin/ab/questions/new', e => console.log(e))
}

/* Help function */
function getType(type){
  if(type == 1){
    return 'General'
  } else if(type == 2){
    return 'Payment'
  }else if(type == 3){
    return 'Product'
  } else if(type == 4){
    return 'Report about seller'
  } else if(type == 5){
    return 'Customer service'
  } else if(type == 6){
    return 'Other'
  }
}


/* API connector */
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
