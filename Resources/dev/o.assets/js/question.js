$(function(){
    setTable();
});


function setTable(){    
    var tableQuestions = new Table('questions', {
        defaultSort: 'createdAt',
        search: "#disabledSearch",
        forPage: "#disabledDrop",
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
              <td>${item.prTitle}</td> 
              <td>${reworkRating(item.prRating)}</td>
              <td>${item.prViews}</td>
              <td>${item.prSold}</td>       
              <td>${new Date(item.updatedAt).toLocaleDateString()}</td>               
            </tr>
          `)
        },
        click: (i, obj, arr) => {
          buttons.renew.removeClass('disabled');
          buttons.delete.removeClass('disabled');
    
          currentItem = {
            i,
            obj,
            arr
          }
        },
        onFocusLost: () => {
          buttons.renew.addClass('disabled');
          buttons.delete.addClass('disabled');
    
          currentItem = null;
        }
    });

    tableQuestions.loadInSegment('/seller/winning/all', head, segment)
}