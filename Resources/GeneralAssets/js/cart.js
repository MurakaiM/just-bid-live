var WCart;

$(function () {
  WCart = new Cart();
});


function Cart() {
  var currentItems = {};

  var dom = $("#shoppingCart");
  var overall = $("#shoppingOverall");
  
  var appender = dom.find('.content');
  var button = dom.find('.submit');
  var empty = dom.find('.empty');

  this.show = () => dom.modal('show');

  this.close = () => dom.modal('hide');

  this.loadJsonData = data => {
    empty.addClass('none');
    button.removeClass('disabled');

    Object.keys(data).forEach( (item,i) => {
      var product = new Product(data[item]);
      currentItems[item] = product;

      appender.append(product.getDom());
    });

    this.forceChanges();
  }

  this.loadUidData = data => {
    appender.addClass('loading');
    button.addClass('loading');

    POST('/api/user/cartLoad',data)
      .then( result => {
        loadJsonData(result.data);
        appender.removeClass('loading');
        button.removeClass('loading');
      })
      .catch( result => {
        appender.removeClass('loading');
        button.addClass('disabled');
      });
  }

  this.forceChanges = () => {
    var total = 0;
    Object.keys(currentItems).forEach( (item,i) =>  total+= parseFloat( currentItems[item].getTotal() ) );  
    overall.text(total.toFixed(2));
    dom.modal("refresh");

    if(Object.keys(currentItems).length == 0){
      empty.removeClass('none');
      button.addClass('disabled');
    }
  }

  this.removeById = id => {
    delete currentItems[id];
    this.forceChanges();
  }

  this.saveToCart = data => {
    var cart;
  
    if (localStorage.getItem('cart') === null) {
        cart = [];
    } else {         
        cart = JSON.parse(localStorage.getItem('cart'));     
     }
     
     cart.push(data);  
     localStorage.setItem('cart', JSON.stringify(cart));
  }

  this.getFromCart = () => {
    var cart;
  
    if (localStorage.getItem('cart') === null) {
        cart = [];
    } else {         
        cart = JSON.parse(localStorage.getItem('cart'));     
    }

    return cart;
  }

  return this;
}


/*
  Product schema

  title
  type
  img_url
  cost
  quantity
  shipment
  sellerLink
  sellerName

*/
function Product(json) {
  var currentData = json;
  var jqItem = generateTemplate(json);
  var timeout;

  var quantityInput = jqItem.find('input');
  var overall,total;

  var costLabel = jqItem.find('.costSpan');
  var totalLabel = jqItem.find('.totalSpan');

  var minusButton = jqItem.find('.minus');
  var plusButton = jqItem.find('.plus');
  var deleteButton = jqItem.find('.item_remove');


  plusButton.click( () => changeQuantity(currentData.quantity+1) );
  minusButton.click( () => changeQuantity(currentData.quantity-1) );
  deleteButton.click( () => deleteDom());

  quantityInput.on('change keyup paste', () => {
      var current = parseInt(quantityInput.val());

      clearTimeout(timeout);
      timeout = setTimeout( () => {
        if(Number.isInteger(current)){

          if(current < 1) changeQuantity(1);
          else if(current > 99) changeQuantity(99)
          else changeQuantity(current)

        }else{
          changeQuantity(currentData.quantity);
        }
      }, 300);

  });

  this.getTotal = () => total;

  this.getDom = () => jqItem;

  function deleteDom(){
    jqItem.remove();

    cart.removeById(currentData.id);
    cart.forceChanges();
  }

  function changeQuantity(quantity) {
    if(quantity < 1) currentData.quantity = 1;
    else if(quantity > 99) currentData.quantity = 99;
    else currentData.quantity = parseInt(quantity);

    quantityInput.val(currentData.quantity);

    overall  = parseFloat( ( currentData.quantity * currentData.cost ) ).toFixed(2);
    total = parseFloat( (currentData.quantity * currentData.cost )+currentData.shipment ).toFixed(2);

    costLabel.text(overall);
    totalLabel.text(total);

    cart.forceChanges();
  }

  function generateTemplate(json) {
    overall  = parseFloat( ( currentData.quantity * currentData.cost ) ).toFixed(2);
    total = parseFloat( (currentData.quantity * currentData.cost )+currentData.shipment ).toFixed(2);

    var dom = `<div class="cart_item">
      <div class="image">
        <img src="${json.img_url}" alt="">
       </div>
      <div class="data">
        <div class="title">${json.title}</div>
        <div class="type">${json.type}</div>
        <div class="seller">Seller :
          <a href="${json.sellerLink}"> ${json.sellerName} </a>
         </div>
       </div>
      <div class="quantity">
        <i class="minus icon"></i>
        <div class="ui input">
          <input type="number" value="${currentData.quantity}" min="1" max="99">
         </div>
        <i class="plus icon"></i>
       </div>
      <div class="price">
        <div class="cost">
          <i class="fa fa-usd" aria-hidden="true"></i>
          <span class="costSpan"> ${overall} </span>
         </div>
        <div class="ship"> <i class="shipping icon"></i> Shipping :
            <span>
              +
              <i class="fa fa-usd" aria-hidden="true"></i>
              <span> ${json.shipment} </span>
            </span>
        </div>
       </div>
      <div class="ui fitted divider"></div>
      <div class="total">
          <i class="fa fa-usd" aria-hidden="true"></i> <span class="totalSpan"> ${total} </span>
       </div>
      <div class="item_remove"> <i class="remove icon"> </i> </div>
     </div>`;

    return $(dom);
  }

}
