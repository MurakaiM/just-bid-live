var tabs, table, tableDisabled, tableAuctions, tableWinnings;
var dataStats, payoutsStats, personalStats;

var winningsDetails;
var winningItem = null;

$(e => onLoad());


function onLoad() {
  $("thead th[data-content]").popup({ position: 'top center' });

  SetUpWinnings();
  SetUpPersonal();
  SetUpProducts();
  SetUpDisabled();
  SetUpPayouts();
  SetUpAuction();
  SetUpHome();

  tabs = new Tabs({
    headers: ".tabs.head",
    contents: ".tabs.body"
   }, {
    winnings: {
      onOpen: (head, segment) => tableWinnings.loadInSegment('/seller/winning/all', head, segment),
      onClose: () => tableWinnings.forceDelete
    },
    products: {
      onOpen: (head, segment) => table.loadInSegment('/seller/product/all', head, segment),
      onClose: () => table.forceDelete()
    },
    disabled: {
      onOpen: (head, segment) => tableDisabled.loadInSegment('/seller/product/disabled', head, segment),
      onClose: () => tableDisabled.forceDelete()
    },
    auctions: {
      onOpen: (head, segment) => tableAuctions.loadInSegment('/seller/auction/all', head, segment),
      onClose: () => tableAuctions.forceDelete()
    },
    home: {
      onOpen: (head, segment) => {
        dataStats.load(head, segment)
      },
      onClose: () => {
        dataStats.image.attr('src','')
      }
    },
    payouts : {
      onOpen: (head, segment) => {
        payoutsStats.load(head, segment)
      },
      onClose: () => {}
    },
    personal : {
      onOpen: (head, segment) => personalStats.load(head, segment),      
      onClose: () => {}
    }
  });
  $("#signout").click(e => POST('/user/signout'));

}

function reworkRating(rating) {
  let rate = parseInt(rating ? rating : 0);
  var template = '<div class="ui star rating rated" >'

  for (var i = 1; i <= 5; i++) {
    if (i <= rate)
      template += '<i class="icon active"></i>'
    else
      template += '<i class="icon"></i>'
  }

  return template + '</div>'
}

function reworkStock(stock, empty) {
  if (empty === true) {
    return `
    <td class="stock negative">
      <i class="attention icon"></i>
      ${stock}
    </td>`
  } else {
    return `<td class="stock">${stock}</td>`
  }
}

function reworkBoolean(bool) {
  let over = bool ? "checkmark green" : "remove red";
  return `<td style="text-align:center;"> <i class="${over} icon"></i> </td>`;
}



function SetUpPayouts(){  
  const payouts = $('#payouts');

  payoutsStats = {
    load : (head,segment) => {
      LoadSegment('/seller/store/payouts', head, segment)
        .then(answer => loadData(answer.result.data, segment))
        .catch();    
    },
    requested : payouts.find(`#requested`),
    pending : payouts.find(`.big.itemed[data-tab="pending"] .money`),
    available : payouts.find(`.big.itemed[data-tab="available"] .money`),
    reqSummary: payouts.find(`.big.itemed[data-tab="requested"] .money`),
    pendingList : payouts.find(`.tab.segment[data-tab="pending"] .grid.wr`),
    requestedList : payouts.find(`.tab.segment[data-tab="requested"] .grid.wr`),
    availableList : payouts.find(`.tab.segment[data-tab="available"] .grid.wr`),
    paidAvailable : false
  };

  $('.menu .itemed').tab({
    'onVisible' : path => (path == 'available' && payoutsStats.paidAvailable) ?  $("#getpaid").removeClass('disabled') : $("#getpaid").addClass('disabled')  
  });

  function loadData(data, segment){
      let pending = { amount : 0, fee : 0 };
      let available = { amount : 0, fee : 0 };
      let lst = { amount : 0, fee : 0 };

      let rq = data.result.requested.payout;

      data.result.requested.requested == true ? 
            payoutsStats.requested.html(
              `<b>\$${toCurrency(rq.amount/100)}</b> was requested at <b>${new Date(rq.createdAt).toLocaleDateString()}</b>. 
               Current status - <b>${rq.status}</b>.
               You can't request new payout until this request is not finished.
              `
            ) : payoutsStats.requested.html('no earnings were requested for now.')
            
      payoutsStats.paidAvailable = !data.result.requested.requested;     

      payoutsStats.pendingList.empty();
      payoutsStats.availableList.empty();
      payoutsStats.requestedList.empty();

      data.result.pending.forEach( elem => {         
        pending.amount += elem.amount ? elem.amount : 0; 
        pending.fee += elem.fee ? elem.fee : 0;        
        payoutsStats.pendingList.append(createRow(elem,false))
      });

      data.result.available.forEach( elem => {        
        elem.amount-=elem.fee; 
        available.amount += elem.amount ? elem.amount : 0; 
        available.fee += elem.fee ? elem.fee : 0;        
        payoutsStats.availableList.append(createRow(elem,true))
      });

      data.result.listed.forEach(elem => payoutsStats.requestedList.append(createRow(elem)));


      if(data.result.pending.length == 0){
        payoutsStats.pendingList.append(createEmpty());
      }

      if(data.result.available.length == 0){
        payoutsStats.availableList.append(createEmpty());
      }

      if(data.result.listed.length == 0){
        payoutsStats.requestedList.append(createEmpty());
      }

      payoutsStats.pending.text(`\$${toCurrency(pending.amount/100)}`)
      payoutsStats.available.text(`\$${toCurrency(available.amount/100)}`)
      payoutsStats.reqSummary.text(`\$${toCurrency(rq ? (rq.amount/100) : 0 )}`)

      segment.removeClass('loading');
  }

  function createRow(elem,rq){
    var template = $(`<div class="row no-margin" data-id="${elem.itemId}">
                        <div class="three wide column flex center"> 
                          <button class="ui compact button">Details</button> 
                        </div>
                        <div class="two wide column flex center">
                          <span class="currency"> \$${toCurrency( (elem.amount ? elem.amount : 0)/100) } </span>
                        </div>
                        <div class="two wide column flex center">
                          <span class="currency">\$${toCurrency( (elem.fee ? elem.fee : 0)/100) } </span>
                        </div>
                        <div class="four wide column flex center">
                          <span class="inline-link"> ${elem.type} </span>
                        </div>     
                        <div class="five wide column flex center"> 
                          <span class="inline-link"> ${new Date(elem.createdAt).toLocaleString() } </span>
                        </div>                                        
                      </div>`
    );
    var id = template.data('id');
    template.find('button').click( e => {
      winningItem = id;
      winningsDetails.toggleState();
    });
    return template;
  }

  function createEmpty(){
    return `<div class="paidempty"> No records to show </div>`
  }
}

function SetUpHome() {
  const wrapper = $("#home");

  dataStats = {
    load: (head, segment) => {
      LoadSegment('/seller/store/statistics', head, segment)
        .then(answer => loadData(answer.result.data, segment))
        .catch();
    },
    wrapper: wrapper,
    image: wrapper.find('img'),
    title: wrapper.find('.title'),
    subtitle: wrapper.find('.subtitle'),
    description: wrapper.find('.description'),
    solds: wrapper.find('.allSolds'),
    views: wrapper.find('.allViews'),
    orders: wrapper.find('.allOrders'),
    products: wrapper.find('.allProducts')
  };

  function loadData(data, segment) {
    dataStats.title.text(data.seller.title);
    dataStats.description.text(data.seller.description);
    dataStats.subtitle.text(data.seller.subtitle),
    dataStats.solds.text(data.allSolds ? data.allSolds : 0);
    dataStats.views.text(data.allViews ? data.allViews : 0);
    dataStats.orders.text(data.allOrders ? data.allOrders : 0);
    dataStats.products.text(data.allProducts ? data.allProducts : 0);

    if (data.seller.cover) {
      dataStats.image.addClass('avatar');
      dataStats.image.attr('src', data.seller.cover)
    }

    segment.removeClass('loading');
  }
}

function SetUpPersonal() {
  const wrapper = $("#personal");
  
  personalStats = {
      data : null,
      load: (head, segment) => {
        LoadSegment('/seller/store/personal', head, segment)
          .then(answer => loadData(answer.result.data, segment))
          .catch();
      },
      wrapper: wrapper,
      paypalForm: wrapper.find('#paypal_update'),
      paypalButton: wrapper.find('#paypal_update button'),
      paypalInput: wrapper.find('#paypal_update input'),
      paypalAvaiting : wrapper.find('#paypal_update .ui.message.yellow'),
      paypalSuccess : wrapper.find('#paypal_update .ui.message.green'),
      paypalError : wrapper.find('#paypal_update .ui.message.red'),

      avatarForm : wrapper.find('#avatar_update'),
      avatarSelectable : wrapper.find('#avatar_update label.ui.button.submit'),
      avatarButton : wrapper.find('#avatar_update button'),
      avatarImg : wrapper.find('#avatar_update img'),
      avatarInput : wrapper.find('#new_avatar'),
      avatarSuccess : wrapper.find('#avatar_update .ui.green'),
      avatarError : wrapper.find('#avatar_update .ui.red'),

      informationForm : wrapper.find('#info_update'),
      informationTitle : wrapper.find('#info_update input[name="title"]'),
      informationSubtitle : wrapper.find('#info_update input[name="subtitle"]'),
      informationDescription : wrapper.find('#info_update textarea[name="description"]'),
      informationButton : wrapper.find('#info_update button'),
      informationSuccess : wrapper.find('#info_update .ui.message.green'),
      informationError : wrapper.find('#info_update .ui.message.red'),
  };

  personalStats.paypalForm.submit(e => {
    e.preventDefault()
    return false
  })
  personalStats.paypalForm.form({ 
    inline : true,
    fields: { 
      paypalEmail : {        
        rules: [{
            type   : 'email',
            prompt : 'Please enter email in valid format'
        }]
      }
    }    
  })
  personalStats.paypalButton.click( e => {
    if(!personalStats.paypalForm.form('is valid'))
      return;

    if(personalStats.paypalInput.val() == personalStats.data.paypalEmail){
      return;
    }

    setPaypalLoading()
    POST('/seller/payout/paypal/update', { email : personalStats.paypalInput.val() })
        .then(e => {          
          removePaypalLoading();

          var currentTime = new Date();
          currentTime.setDate(currentTime.getDate()+3);

          personalStats.paypalSuccess.addClass('hidden');
          personalStats.paypalAvaiting.removeClass('hidden');

          $("#paypal_date").text(currentTime.toLocaleDateString());
        })
        .catch(error => removePaypalLoading())
  })


  personalStats.avatarForm.submit(e => {
    e.preventDefault();
    return false
  })
  personalStats.avatarButton.click( e => {  
    setAvatarLoading();
    FormPOST('/seller/avatar/update', new FormData(personalStats.avatarForm[0]))
          .then(e => {
            removeAvatarLoading();
            personalStats.avatarSuccess.removeClass('hidden')
            setTimeout(e => personalStats.avatarSuccess.addClass('hidden'), 5000)
          })
          .catch(e => {
             removeAvatarLoading()
             personalStats.avatarError.removeClass('hidden')
             setTimeout(e => personalStats.avatarError.addClass('hidden'), 5000)
          })
  })


  personalStats.informationForm.submit( e => {
    e.preventDefault()
    return false
  })
  personalStats.informationForm.form({
    fields: { 
      title : {        
        rules: [{
            type   : 'empty',
            prompt : 'Please enter store title'
        }]
      },
      subtitle : {        
        rules: [{
            type   : 'empty',
            prompt : 'Please enter store subtitle'
        }]
      },
      description : {        
        rules: [{
            type   : 'empty',
            prompt : 'Please enter store description'
         },{
            type   : 'maxLength[255]',
            prompt : 'Description is too long'
        }]
      }
    }    
  })
  personalStats.informationButton.click(e => {   
    if(!personalStats.informationForm.form('is valid'))
      return;

    setInfoLoading();
    POST('/seller/information/update', { 
        title : personalStats.informationTitle.val(),
        subtitle : personalStats.informationSubtitle.val(),
        description : personalStats.informationDescription.val()
      }).then( result => {
        removeInfoLoading()
        personalStats.informationSuccess.removeClass('hidden')
        setTimeout(e => personalStats.informationSuccess.addClass('hidden'), 5000)
      }).catch( error => {
        removeInfoLoading()
        personalStats.informationError.removeClass('hidden')
        setTimeout(e => personalStats.informationError.addClass('hidden'), 5000)
      });


  })  

  personalStats.avatarInput.on('change', event => readURL(personalStats.avatarInput, personalStats.avatarImg))


  function setInfoLoading(){
    personalStats.informationButton.addClass('loading')

    personalStats.informationTitle.addClass('disabled')
    personalStats.informationSubtitle.addClass('disabled')
    personalStats.informationDescription.addClass('disabled')
  }

  function removeInfoLoading(){
    personalStats.informationButton.removeClass('loading')
    
    personalStats.informationTitle.removeClass('disabled')
    personalStats.informationSubtitle.removeClass('disabled')
    personalStats.informationDescription.removeClass('disabled')
  }


  function setAvatarLoading(){
    personalStats.avatarButton.addClass('loading')
    personalStats.avatarSelectable.addClass('disabled')
  }

  function removeAvatarLoading(){
    personalStats.avatarButton.removeClass('loading')
    personalStats.avatarSelectable.removeClass('disabled')
  }

  
  function setPaypalLoading(){
      personalStats.paypalButton.addClass('loading')
      personalStats.paypalInput.addClass('disabled')
  }

  function removePaypalLoading(){
    personalStats.paypalButton.removeClass('loading')
    personalStats.paypalInput.removeClass('disabled')
  }


  function loadData(data, segment){  
    personalStats.data = data;
        
    if(data.paypalEmail){
        personalStats.paypalInput.val(data.paypalEmail)

        if(new Date().getTime() < new Date(data.paypalAccepted).getTime() ){
          personalStats.paypalAvaiting.removeClass('hidden');
          $("#paypal_date").text(new Date(data.paypalAccepted).toLocaleDateString());
        }else{
          personalStats.paypalSuccess.removeClass('hidden');
        }
    }

    if(data.cover){
      personalStats.avatarImg.addClass('avatar')
      personalStats.avatarImg.attr('src',data.cover)
    }

    personalStats.informationTitle.val(data.title)
    personalStats.informationSubtitle.val(data.subtitle)
    personalStats.informationDescription.val(data.description)

    segment.removeClass('loading')  
  }
}

function SetUpProducts() {
  $(".ui.small.icon.button").popup({
    position: 'bottom center',
  });

  let currentItem = null,currentTemp = null;
  const buttons = {
    open: $("#productsOpen"),
    delete: $("#productsDelete"),
    create: $("#productsCreate"),
    auction: $("#productAuction"),
    edit: $("#productsEdit"),
    change : $("#productsChange"),
    refresh: $("#productsRefresh")
  }

  Simditor.locale = 'en-US';
  toolbar = ['title', 'bold', 'italic', 'underline', 'strikethrough', 'fontScale', 'color', '|', 'ol', 'ul', 'blockquote', 'table', '|', 'link', 'image', 'hr', '|', 'indent', 'outdent', 'alignment'];

  table = new Table('products', {
    defaultSort: 'updatedAt',
    search: "#productsSearch",
    forPage: "#productsDrop",
    buttons: {
      previous: ".left.icon.item",
      next: ".right.icon.item",
      to: ".ui.button.radiusless.borderless"
    },
    input: {
      to: ".ui.left.action input"
    },
    row: item => {
      let hasError = false;

      item.types.forEach(e => e.inStock <= 0 ? hasError = true : false);

      return $(`
        <tr>
          <td>${item.prTitle}</td>
          ${reworkStock(item.prStock,hasError)}
          <td><i class="dollar icon"></i>${toCurrency(item.prCost)}</td>          
          ${reworkBoolean(item.auctions.length > 0)}
          <td>${item.prViews}</td>
          <td>${item.prSold}</td>       
          <td>${new Date(item.updatedAt).toLocaleDateString()}</td>
          <td>${new Date(item.createdAt).toLocaleDateString()}</td>         
        </tr>
      `)
    },
    click: (i, obj, arr) => {
      buttons.auction.removeClass('disabled');
      buttons.delete.removeClass('disabled');
      buttons.edit.removeClass('disabled');
      buttons.open.removeClass('disabled');
      buttons.change.removeClass('disabled');


      currentItem = {
        i,
        obj,
        arr
      }
      currentTemp = {
        i
      }
    },
    onFocusLost: () => {
      buttons.auction.addClass('disabled');
      buttons.delete.addClass('disabled');
      buttons.edit.addClass('disabled');
      buttons.open.addClass('disabled');
      buttons.change.addClass('disabled')

      currentItem = null;
    }
  });


  const nestedColor = new NestedList('#typesColorist', {
    listplace: '.ui.grid',
    submiter: '.teal',
    isFiled: {
      inputName: "image",
      pathName: "path",
      buttonName: "imagebutton"
    },
    inputs: [{
        as: "title",
        name: 'titleVR',
        valid: value => {
          if (value.length == 0) return false;
          return true;
        }
      },
      {
        as: "value",
        name: 'valueVR',
        valid: value => value.length != 0
      },
      {
        name: "path",
        valid: value => value.length > 0
      },
      {
        name: 'color',
        valid: obj => true
      },
      {
        name: 'image',
        valid: value => value.length != 0
      }
    ],
    mockuper: (data, id) => {
      const placer = data.image ? `<img src="${data.uri}" />` : " - ";

      let template = $(`   
          <div class="row">   
            <div class="four wide column">${data.title}</div>
            <div class="four wide column">${data.value}</div>          
            <div class="two wide column"><a class="ui circular empty label" style="background : ${data.color}; "></a> </div>
            <div class="four wide column">${placer}</div>
            <div class="two wide column">
              <button class="ui icon button red small"> <i class="trash outline icon"></i> </button>
            </div>  
          </div>      
        `);
      template.find('button').click(e => {
        template.remove();
        nestedColor.forceDelete(id);
      });

      return $(template);
    },
    maxSize: 10
  });

  const nestedSize = new NestedList('#typesSize', {
    listplace: '.ui.grid',
    submiter: '.teal',
    inputs: [{
        as: "title",
        name: 'titleVR',
        valid: value => {
          if (value.length == 0) return false;
          return true;
        }
      },
      {
        as: "value",
        name: 'valueVR',
        valid: value => {
          if (value.length == 0) return false;
          return true;
        }
      }
    ],
    mockuper: (data, id) => {
      let template = $(`   
        <div class="row">   
          <div class="seven wide column">${data.title}</div>
          <div class="seven wide column">${data.value}</div>  
          <div class="two wide column">
            <button class="ui icon button red small"> <i class="trash outline icon"></i> </button>
          </div>  
        </div>      
      `);
      template.find('button').click(e => {
        template.remove();
        nestedSize.forceDelete(id);
      });

      return $(template);
    }
  });

  const Creator = new NestedCreator(nestedColor, nestedSize, '#typesStock');


  const editor = new Simditor({
    textarea: $("#createModal .wwc"),
    toolbar: toolbar,
    defaultImage: '../<%=resources%>/g.assets/img/usericons/image.png'
  });

  const deleteModal = new Modal({
    id: "#deleteModal",
    onOpen: body => body.find('.exact').text(currentItem.arr[currentItem.i].prTitle),
    onClose: body => {
      body.find('input').val('')
      body.find('button').addClass('disabled');
    },
    middleware: body => {
      const form = body.find('form');
      const input = body.find('input');
      const button = body.find('button');
      button.addClass('disabled');

      input.on('change keyup paste', e => {
        if (e.target.value == currentItem.arr[currentItem.i].prTitle) {
          button.removeClass('disabled');
        } else {
          button.addClass('disabled');
        }
      });

      button.click(e => {
        button.addClass('loading');
        POST('/seller/product/delete', {
            uid: currentItem.arr[currentItem.i].prUid
          })
          .then(data => {
            currentItem.arr.splice(currentItem.i, 1);
            deleteModal.toggleState();
            button.removeClass('loading');
            table.redraw();
          })
          .catch(error => {
            deleteModal.toggleState();
            button.removeClass('loading');
          });
      });
    }
  }, true);

  const createModal = new Modal({
    id: "#createModal",
    closer: ".closer",
    closable: true,
    overflowed: true,
    onOpen: body => {
      body.find('form').form('clear');
      nestedColor.forceEmpty();
      editor.setValue('');
      Creator.forceEmpty();
      nestedSize.forceEmpty();
      nestedColor.forceEmpty();
    },
    onClose: body => {},
    middleware: (body, props, createModal) => createForm(createModal, body, nestedColor, nestedSize, editor, table)
  }, false);

  const changeModal = new Modal({
    id : "#changeModal",
    closer : ".closer",
    closable : true,
    overflowed : true,
    onOpen : (body,props) => {
      props.exact.text(currentItem.arr[currentItem.i].prTitle)
      props.description.val(currentItem.arr[currentItem.i].prDescription)
      props.full.setValue(currentItem.arr[currentItem.i].prFull)
    },
    onClose : body => {},
    middleware : (body,props, modal) => {
      props.exact = body.find('.exact')
      props.description = body.find('textarea[name="description"]')     
      props.full = new Simditor({
        textarea: $("#changeModal .wwc"),
        toolbar: toolbar,
        defaultImage: '../<%=resources%>/g.assets/img/usericons/image.png'
      });

      props.form = new Form(body.find('form'),'/seller/product/change', {
        inline: true,
        on: 'blur',
        rules: {
          delivery : {
            identifier: 'delivery',
            rules: [{
              type: 'integer[1..180]',
              prompt: 'Please enter valid delivery time (days)'
            }]
          },
        },
        dataMiddleware: data => {
          data.id = currentItem.arr[currentItem.i].prUid;
          data.full = props.full.getValue();          
          return data;
        },
        success: data => setTimeout(e => modal.toggleState(), 3000),
        failure: (error,form) => {}    
      })
    }
  },false);

  const editModal = new Modal({
    id: "#editModal",
    reset: true,
    overflowed: true,
    closer: ".closer",
    onOpen: (body, props) => {
      let id = currentItem.arr[currentItem.i].prUid;

      props.input.val(currentItem.arr[currentItem.i].prStock);
      props.name.text(currentItem.arr[currentItem.i].prTitle);
      props.types.addClass('loading');
      props.types.empty();
      props.stock.addClass('loading');
      props.stock.empty();

      POST('/seller/product/types', {
          id
        })
        .then(result => createTypes(props.types, id, result.data))

      POST('/seller/product/stocks', {
          id
        })
        .then(result => createStock(props.stock, id, result.data))

    },
    onClose: (body, props) => {},
    middleware: (body, props, modal) => {
      props.input = body.find('form').find('input');
      props.types = body.find('.ui.segment.types');
      props.stock = body.find('.ui.segment.stock');
      props.name = body.find('.exact');
    }
  }, true);

  const auctionModal = new Modal({
    id: "#auctionNewModal",
    reset: true,
    overflowed: true,
    onOpen: (body, props) => {
      props.form.removeClass('success error');
      props.form.form('reset');

      props.dropdown.dropdown('clear');

      props.fee.val('Fee');
      props.exp.val('Explanation');
      props.ape.val('Appearence');
      props.str.val('Starting price')

      props.exact.text(currentItem.arr[currentItem.i].prTitle);
    },
    onClose: (body, props) => {},
    middleware: (body, props, modal) => {
      const options = {
        inline: true,
        on: 'blur',
        rules: {
          stock: {
            identifier: 'stock',
            rules: [{
              type: 'integer[1..99999]',
              prompt: 'Stock should be positive number (1 - 99999)'
            }]
          },
          type: {
            identifier: 'type',
            rules: [{
              type: "empty",
              prompt: 'Select type of auction item'
            }]
          },
          str : {
            identifier: 'str',
            rules: [{
              type: "currency",
              prompt: 'Select valid auction starting price'
            }] 
          }
        },
        dataMiddleware: data => {
          data.uidProduct = currentItem.arr[currentItem.i].prUid;
          return data;
        },
        success: data => {

        },
        failure: (error,form) => {
          
        }     
      };

      props.form = body.find('form');
      props.submit = props.form.find('button');
      props.exact = body.find('.exact');

      props.fee = body.find('input[name="fee"]');
      props.exp = body.find('input[name="exp"]');
      props.ape = body.find('input[name="ape"]');
      props.str = body.find('input[name="str"]')

      props.dropdown = body.find('.ui.dropdown').dropdown({
        onChange: (value, text, $choice) => {
          if (!currentFees[value])
            return;

          props.fee.val(((currentFees[value].type == 'dollar') ? "$"+String(currentFees[value].fee) : String(currentFees[value].fee)+"%"))
          props.ape.val(currentFees[value].appearance)
          props.exp.val(currentFees[value].explanation)

          if(value == 'reserved'){     
            props.str.parent().removeClass('partlydisabled')
            props.str.val('')
          }else{        
            props.str.parent().addClass('partlydisabled')
            props.str.val(currentFees[value].begin)
          }  
                  
          props.form.form('validate field','str');
        }
      });

      props.preparedForm = new Form(props.form, '/seller/auction/create', options);
    }
  }, false);


  buttons.delete.click(e => deleteModal.toggleState());
  buttons.create.click(e => createModal.toggleState());
  buttons.auction.click(e => auctionModal.toggleState());
  buttons.change.click(e => changeModal.toggleState());
  buttons.edit.click(e => editModal.toggleState());
  buttons.open.click(e => window.open(`/product/id${currentItem.arr[currentItem.i].prUid}`));

  buttons.refresh.click(e => table.loadFromCache());

  function createForm(createModal, body, nestedColor, nestedSize, editor, table) {
    $(body.find('.ui.search.cat')).search({
      type: 'category',
      minCharacters: 2,
      apiSettings: {
        onResponse: response => {
          response.results = {};
          response.data.forEach(function (item, index) {

            var language = item.category || 'Unknown',
              maxResults = 8;

            if (index >= maxResults) {
              return false;
            }

            if (response.results[language] === undefined) {
              response.results[language] = {
                name: language,
                results: []
              };
            }

            response.results[language].results.push({
              title: item.name
            });

          });
          return response;
        },
        url: '/seller/categories/search={query}'
      }
    });

    const simpleRules = {
      on: 'blur',
      inline: true,
      rules: {
        title: {
          identifier: 'title',
          rules: [{
            type: 'empty',
            prompt: 'Please enter product title'
          }]
        },
        cost: {
          identifier: 'cost',
          rules: [{
            type: 'currency',
            prompt: 'Please enter valid cost in format XX.XX'
          }]
        },
        shipment: {
          identifier: 'shipment',
          rules: [{
            type: 'shipment',
            prompt: 'Please enter valid cost in format XX.XX (0$ - 30$)'
          }]
        },
        delivery : {
          identifier: 'delivery',
          rules: [{
            type: 'integer[1..180]',
            prompt: 'Please enter valid delivery time (days)'
          }]
        },
        category: {
          identifier: 'category',
          rules: [{
            type: 'empty',
            prompt: 'Please search for categories and select'
          }]
        },
        description: {
          identifier: 'description',
          rules: [{
              type: 'empty',
              prompt: 'Please enter product description'
            },
            {
              type: 'minLength[20]',
              prompt: 'Minimum 20 symbols'
            },
            {
              type: 'maxLength[250]',
              prompt: 'Maximum 250 symbols'
            }
          ]
        },        
        stock: {
          identifier: 'material',
          rules: [{
            type: 'empty',
            prompt: 'Please enter material title of product'
          }]
        },
        guarantee: {
          identifier: 'guarantee',
          rules: [{
            type: 'integer[1..72]',
            prompt: 'Please enter guarantee (Months)'
          }]
        }
      },
      success: data => {
        table.forceRow(data);
        nestedColor.forceEmpty();
        editor.setValue('');
        createModal.toggleState();
      },
      dataMiddleware: currentData => {
        Object.keys(nestedColor.getData()).forEach(e => delete nestedColor.getData()[e].uri)
        Object.keys(nestedColor.getData()).forEach(e => currentData.append('filefor' + e, nestedColor.getData()[e].image));

        currentData.append('colors', JSON.stringify(nestedColor.getData()));
        currentData.append('sizes', JSON.stringify(nestedSize.getData()))
        currentData.append('full', editor.getValue());

        return currentData;
      }
    }

    const form = new Form(body.find('form'), '/seller/product/create', simpleRules, true);
    Creator.setForm(form);
    return
  }

  function createTypes(placeholder, product, data) {
    placeholder.empty();
    placeholder.append(generate(product, 'colors', data.prTypes.colors));
    placeholder.append(generate(product, 'sizes', data.prTypes.sizes))
    placeholder.removeClass('loading');
  }

  function generate(product, group, perset) {
    if (!perset) {
      return;
    }

    if (Object.keys(perset).length == 0) {
      return;
    }

    const readyWrap = $(`<div class='ui grid'></div>`);
    Object.keys(perset).forEach(element => readyWrap.append(new RowType(group, product, perset[element]).template()));
    readyWrap.append(`<div class="ui divider fitted"></div>`);
    return readyWrap;
  }

  function createStock(placeholder, product, data) {
    placeholder.empty();
    placeholder.append(generate('stocks', data));
    placeholder.removeClass('loading');

    function generate(group, perset) {
      if (!perset) {
        return;
      }

      if (Object.keys(perset).length == 0) {
        return;
      }

      const readyWrap = $(`<div class='ui grid'></div>`);
      Object.keys(perset).forEach(element => readyWrap.append(new RowStock(product, perset[element]).template()));
      readyWrap.append(`<div class="ui divider fitted"></div>`);
      return readyWrap;
    }
  }

  function RowType(group, product, data) {
    this.isDisabled = data.disable == true ? true : false;

    this.generateButton = isDisabled => {
      let props = {};
      if (isDisabled == true) {
        props.classes = "ui button tiny green"
        props.title = "Enable"
      } else {
        props.classes = "ui button tiny red"
        props.title = "Disable"
      }
      return `<button type="button" class="${props.classes}"> ${props.title} </button>`
    }

    this.switchButton = button => {
      button.toggleClass('loading');

      if (this.isDisabled) {
        button.removeClass('red');
        button.addClass('green');
        button.text("Enable");
      } else {
        button.removeClass('green');
        button.addClass('red');
        button.text("Disable");
      }
    }

    this.row = $(`<div class="three column row wrap">
      <div class="column flexfull center">${data.title}</div>
      <div class="column"> <input type="text" class="partlydisabled" value="${data.value}"/></div>
      <div class="column flexfull center"> ${this.generateButton(this.isDisabled)} </div>
    </div>`);

    this.button = this.row.find('button');
    this.button.click(e => {
      this.button.addClass('loading');
      this.isDisabled = !this.isDisabled;
      POST('/seller/product/typesout', {
        uid: product,
        available: this.isDisabled,
        name: data.value,
        group: group
      }).then(result => this.switchButton(this.button))
    });

    this.template = () => this.row;
    return this;
  }

  function RowStock(product, data) {
    this.row = $(`    
        <div class="row wrap"> 
          <form class="column ui form">
              <div class="three fields">        
                <div class="field flexfull center">${data.title}</div>
                <div class="field"> <input type="text" name="stock" value="${data.inStock}"/> </div>
                <div class="field flexfull center"> <button type="submit" class="ui button tiny submit" > Update </button> </div>  
              </div> 
              <div class="ui message success">
                  <div class="header">Action Completed</div>
                  <p> Product's type stock was updated </p>
              </div>
              <div class="ui custom message error">
                <div class="header">Action Forbidden</div>
                <p></p>
              </div>
          </form>  
        </div>
      `);

    this.form = new Form(this.row.find('form'), '/seller/product/stock', {
      on: 'blur',
      inline: true,
      delay: 250,
      justbutton: true,
      rules: {
        stock: {
          identifier: 'stock',
          rules: [{
            type: 'integer[1..99999]',
            prompt: 'Please enter valid stock value(1 - 99999)'
          }]
        }
      },
      dataMiddleware: wrapped => {
        wrapped.productId = product;
        wrapped.typeId = data.typeId;
        return wrapped;
      },
      success: (fetched, form) => {
        table.forceChange(currentTemp.i, fetched);
        setTimeout(e => form.removeClass('success'), 3000);
      },
      failure: (fetched, form) => setTimeout(e => form.removeClass('error'), 3000)
    });

    this.template = () => this.row;
    return this;
  }
}

function SetUpDisabled() {
  let currentItem = null;
  const buttons = {
    renew: $("#disabledRenew"),
    delete: $("#disabledDelete"),
    refresh: $("#disabledRefresh")
  }

  tableDisabled = new Table('disabled', {
    defaultSort: 'updatedAt',
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

  const renewModal = new Modal({
    id: "#renewModal",
    onOpen: body => body.find('.exact').text(currentItem.arr[currentItem.i].prTitle),
    onClose: body => {
      body.find('input').val('')
      body.find('button').addClass('disabled');
    },
    middleware: body => {
      const input = body.find('input');
      const button = body.find('button');
      button.addClass('disabled');

      input.on('change keyup paste', e => {
        if (e.target.value == currentItem.arr[currentItem.i].prTitle) {
          button.removeClass('disabled');
        } else {
          button.addClass('disabled');
        }
      });

      button.click(e => {
        button.addClass('loading');
        POST('/seller/product/renew', {
            uid: currentItem.arr[currentItem.i].prUid
          })
          .then(data => {
            currentItem.arr.splice(currentItem.i, 1);
            tableDisabled.redraw();
            button.removeClass('loading');
            renewModal.toggleState();
          })
          .catch(error => {
            renewModal.toggleState();
            button.removeClass('loading');
          });
      });
    }
  }, true);

  const finishModal = new Modal({
    id: "#finishModal",
    onOpen: body => {
      body.find('.exact').text(currentItem.arr[currentItem.i].prTitle)
      body.find('form').removeClass('error');
    },
    onClose: body => {
      body.find('input').val('')
      body.find('button').addClass('disabled');
    },
    middleware: body => {
      const input = body.find('input');
      const button = body.find('button');
      const form = body.find('form');
      const error = body.find('.error.message p');

      button.addClass('disabled');

      input.on('change keyup paste', e => {
        if (e.target.value == currentItem.arr[currentItem.i].prTitle) {
          button.removeClass('disabled');
        } else {
          button.addClass('disabled');
        }
      });

      button.click(e => {
        button.addClass('loading');
        POST('/seller/product/remove', {
            uid: currentItem.arr[currentItem.i].prUid
          })
          .then(data => {
            currentItem.arr.splice(currentItem.i, 1);
            tableDisabled.redraw();
            button.removeClass('loading');
            finishModal.toggleState();
          })
          .catch(err => {
            error.text(err.reason);
            form.addClass('error');
            button.removeClass('loading');
          });
      });
    }
  }, true);


  buttons.renew.click(e => renewModal.toggleState());
  buttons.delete.click(e => finishModal.toggleState());
  buttons.refresh.click(e => tableDisabled.loadFromCache());
}

function SetUpAuction() {
  let currentItem = null;
  const buttons = {
    stock: $("#auctionsStock"),
    pause: $("#auctionsPause"),
    refresh: $("#auctionsRefresh")
  }

  const stock = new Modal({
    id: "#auctionUpdateModal",
    onOpen: (body, props) => body.find('.exact').text(currentItem.arr[currentItem.i].product.prTitle),
    onClose: (body, props) => body.find('input').val(''),
    middleware: (body, props, modal) => {
      let options = {
        on: 'blur',
        inline: true,
        rules: {
          stock: {
            identifier: 'stock',
            rules: [{
              type: 'integer[1..99999]',
              prompt: 'Stock should be positive number (1 - 99999)'
            }]
          }
        },
        dataMiddleware: data => {
          data.uidRecord = currentItem.arr[currentItem.i].uidRecord;
          return data;
        },
        success: data => {
          let current = currentItem.arr[currentItem.i];
          current.inStock = data;
          tableAuctions.forceChange(currentItem.i, current);
        },
        failure: failure => {}
      };

      props.form = new Form(body.find('form'), "/seller/auction/stock", options);
    }
  }, true);

  const pause = new Modal({
    id: "#auctionPauseModal",
    onOpen: (body, props) => {
      props.exact.text(currentItem.arr[currentItem.i].product.prTitle);
      props.current = currentItem;

      if (currentItem.arr[currentItem.i].temporaryDisabled) {
        props.button.text('Unpause');
        props.button.removeClass('red');
        props.button.addClass('green');
      } else {
        props.button.text('Pause');
        props.button.removeClass('green');
        props.button.addClass('red');
      }

    },
    onClose: (body, props) => props.current = null,
    middleware: (body, props, modal) => {
      const options = {
        rules: {
          button: {
            identifier: 'title',
            rules: [{
              type: "empty"
            }]
          }
        },
        dataMiddleware: data => {
          data.uidRecord = props.current.arr[props.current.i].uidRecord;
          data.temporaryDisabled = !props.current.arr[props.current.i].temporaryDisabled;
          return data;
        },
        success: data => {
          let current = props.current.arr[props.current.i];
          current.temporaryDisabled = !current.temporaryDisabled;
          tableAuctions.forceChange(props.current.i, current);
          redrawButton(props, current.temporaryDisabled);
        }
      };

      props.exact = body.find('.exact');
      props.button = body.find('button');

      props.form = new Form(body.find('form'), "/seller/auction/pause", options);
    }
  }, true)

  tableAuctions = new Table('auctions', {
    defaultSort: 'updatedAt',
    search: "#auctionsSearch",
    forPage: "#auctionsDrop",
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
          <td>${item.productTitle}</td> 
          <td>${currentFees[item.uidFee].title}</td>
          <td>${item.inStock}</td>
          <td><i class="dollar icon"></i>${toCurrency(item.currentBid)}</td>       
          ${reworkBoolean(item.onAuction)}
          ${reworkBoolean(item.isCompleted)}
          ${reworkBoolean(item.temporaryDisabled)}
          <td>${new Date(item.updatedAt).toLocaleDateString()}</td>
          <td>${new Date(item.createdAt).toLocaleDateString()}</td>   
        </tr>
      `)
    },
    transformation: value => {
      value.currentBid = value.currentBid / 100;
      value.productTitle = value.product.prTitle;
      return value;
    },
    click: (i, obj, arr) => {
      buttons.stock.removeClass('disabled');
      buttons.pause.removeClass('disabled');

      currentItem = {
        i,
        obj,
        arr
      }
    },
    onFocusLost: () => {
      buttons.stock.addClass('disabled');
      buttons.pause.addClass('disabled');

      currentItem = null;
    }
  })

  buttons.refresh.click(e => tableAuctions.loadFromCache());
  buttons.stock.click(e => stock.toggleState())
  buttons.pause.click(e => pause.toggleState());
}

function SetUpWinnings() {
  let currentItem = null;
  const buttons = {
    details: $("#winningsDatails"),
    update: $("#winningsUpdate"),
    refresh: $("#winningsRefresh")
  }

  const winningsUpdate = new Modal({
    id: "#winningUpdateModal",
    onOpen: (body, props) => body.find('.exact').text(currentItem.arr[currentItem.i].winnerName),
    onClose: (body, props) => {},
    middleware: (body, props, modal) => {
      let options = {
        on: 'blur',
        inline: true,
        rules: {
          track: {
            identifier: 'track',
            rules: [{
              type: 'empty',
              prompt: 'Type clear and proper status description'
            }]
          }
        },
        dataMiddleware: data => {
          data.record = currentItem.arr[currentItem.i].winningId;
          return data;
        },
        success: data => {
          let current = currentItem.arr[currentItem.i];
          current.productTrack = data;
          current.status = "Sent";
          tableWinnings.forceChange(currentItem.i, current);
        },
        failure: failure => console.log(error)
      }

      props.form = new Form(body.find('form'), "/seller/winning/track", options);
    }
  }, true);

  winningsDetails = new Modal({
    id: "#winningDetailsModal",
    onOpen: (body, props) => {
      props.segment.addClass('loading')
      POST('/seller/winning/especial', {
          winningId: winningItem 
        })
        .then(answer => props.insertInto(answer.data))
        .catch(error => console.log(error))
    },
    onClose: (body, props) => props.deleteInfo(),
    middleware: (body, props, modal) => {
      props.segment = body.find('.ui.segment');
      props.dataValues = body.find('.details.value');
      props.addresses = body.find('.col-md-6.nopadding.addressed')

      props.insertInto = data => {
        $(props.dataValues[0]).text(data.user.firstName + " " + data.user.lastName);
        $(props.dataValues[2]).text(data.customerInformation ? "Address was selected" : "No address was selected yet");

        $(props.dataValues[1]).find('a').attr('href', `/product/id${data.productId}`);
        $(props.dataValues[1]).find('a').text(data.product.prTitle)

        $(props.dataValues[3]).text(data.type ? data.type.title : 'Type has not been selected yet');
        $(props.dataValues[4]).text(data.productTrack);
        $(props.dataValues[5]).text(data.status);
        $(props.dataValues[6]).text(`\$ ${toCurrency(data.lastBid/100)}`);
        $(props.dataValues[7]).text(`\$ ${toCurrency(data.product.prShipment)}`);
        $(props.dataValues[8]).text(data.billingId ? 'Yes' : 'No');

        if (data.customerInformation) {
          props.addresses.removeClass('closed')

          $(props.dataValues[9]).text(data.customerInformation['shipping[first-name]']);
          $(props.dataValues[10]).text(data.customerInformation['shipping[last-name]']);
          $(props.dataValues[11]).text(data.customerInformation['shipping[address]']);
          $(props.dataValues[14]).text(data.customerInformation['shipping[country]']);
          $(props.dataValues[12]).text(data.customerInformation['shipping[city]']);
          $(props.dataValues[13]).text(data.customerInformation['shipping[code]']);
          $(props.dataValues[15]).text(data.customerInformation['shipping[phone]']);        
        } else {
          props.addresses.addClass('closed')
        }
        props.segment.removeClass('loading')
      }

      props.deleteInfo = () => props.dataValues.each( (i,e) => i != 1 ? $(e).text('') : $(e).find('a').text('') );
    }
  }, true);

  tableWinnings = new Table('winnings', {
    defaultSort: 'updatedAt',
    search: "#winningsSearch",
    forPage: "#winningsDrop",
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
          <td>${item.winnerName}</td>      
          <td><i class="dollar icon"></i>${toCurrency(item.lastBid)}</td>     
          ${reworkStatus(item.status)} 
          <td>${item.productTrack ? item.productTrack : "Empty" }</td>
          ${reworkBoolean(item.isPaid)}
          <td>${new Date(item.updatedAt).toLocaleDateString()}</td>
          <td>${new Date(item.createdAt).toLocaleDateString()}</td>   
        </tr>
      `)
    },
    transformation: value => {
      value.winnerName = value.user.firstName + " " + value.user.lastName;
      value.lastBid = value.lastBid / 100;
      return value;
    },
    click: (i, obj, arr) => {
      buttons.details.removeClass('disabled')
      buttons.update.removeClass('disabled')
      currentItem = { i,obj,arr }
      winningItem = currentItem.arr[currentItem.i].winningId
    },
    onFocusLost: () => {
      currentItem = null;
      buttons.details.addClass('disabled')
      buttons.update.addClass('disabled')
    }
  });

  buttons.refresh.click(e => tableWinnings.loadFromCache());
  buttons.update.click(e => winningsUpdate.toggleState())
  buttons.details.click(e => winningsDetails.toggleState());
}


function numberRebase(number) {
  if (number < 100) {
    return number;
  }

  if (number < 1000) {
    return (parseFloat(number).toFixed(2) / 1000) + "h";
  }

  if (number < 1000000) {
    return (parseFloat(number).toFixed(2) / 1000) + "th";
  }

}

function redrawButton(props, temporaryDisabled) {
  if (temporaryDisabled) {
    props.button.text('Unpause');
    props.button.removeClass('red');
    props.button.addClass('green');
  } else {
    props.button.text('Pause');
    props.button.removeClass('green');
    props.button.addClass('red');
  }
}

function reworkStatus(status){
  var cls = '';
  
  if(status == 'New')
    cls = 'pr'
  else if(status == 'Paid')
    cls = 'gr'

  return `
    <td>
      <b class="light ${cls}"> 
        ${status} 
      </b>
    </td>
  `;
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


let currentFees = {
  standard: {
    fee: 2,
    begin : 2,
    type: "dollar",
    title: "Standard Listing",
    explanation: "Bids Begin at $2 and bids goes up at $1 at a time",
    appearance: "No Color Border"
  },
  featured: {
    fee: 3,
    begin : 3,
    type: "dollar",
    title: "Featured Listing",
    explanation: "Bids Begin at $3 and bids goes up at $1 at a time",
    appearance: "Purple Color Border"
  },
  small: {
    fee: 5,
    begin : 1,
    type: "per",
    title: "Standard 20% Percent",   
    explanation: "Bids Begin at $1 and bids goes up at 20% at a time",
    appearance: "Orange Color Border"
  },
  big: {
    fee: 10,
    begin : 1,
    type: "per",
    title: "Big Percentage 50%",
    explanation: "Bids Begin at $1 and bids goes up at 50% at a time",
    appearance: "Pink Color Border"
  },
  reserved : {
    fee : 15,
    begin : "custom",
    type: "per",
    title: "Reserved Listing",
    explanation : "Bids Begin at selected price aand bids goes up at $1 at a time",
    appearance : "Red Color Border"    
  }
}