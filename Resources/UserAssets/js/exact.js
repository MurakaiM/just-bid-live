var shapeDom;
var currentItemId;

$(function () {
  $('.menu .item').tab();

  setSlider();
  dropdownListen();

  setTimeout(() => $('.exactly.wrapper').addClass('opened'), 200);

  currentItemId = $("#cart").data('id');
  $("#cart").click(() => addProduct());
});

function addProduct() {
  var types = "";
  var valid = true;

  var allTypes = $('.types .dropdown');
  $('.types .dropdown').each((i, item) => {
    var value = $(item).dropdown('get value');

    if (value.length == 0) {
      $(item).addClass('error');
      valid = false;
    } else {
      $(item).removeClass('error');
      types += value;
    }

    if (i != allTypes.length - 1) types += ',';
  });


  if (!valid) return;

  var result = {
    id: currentItemId,
    quantity: $("#quantity").val(),
    types: types
  };

  WCart.saveToCart(result);

  console.log(WCart.getFromCart());
}


function dropdownListen() {
  $("#quantity").change(e => {
    var parsed = parseInt(e.target.value);

    if (isNaN(parsed)) {
      e.target.value = 1;
      return;
    }

    if (parseInt(e.target.value) > 99) {
      e.target.value = 99;
      return;
    }

  });

  $('.types .dropdown').each((i, item) => $(item).dropdown({
    onChange: () => $(item).removeClass('error')
  }));

  var color = $("#color").dropdown({
    onChange: (value, text, $selectedItem) => {
      color.removeClass('error')
      shapeDom.shape('set next side', '#' + value).shape('flip up');
    }
  });

}

function setSlider() {
  if (!WProps.isMobile) {
    $('.exactly.aller').sticky({
      context: '.col-md-4.col-lg-4'
    });
    var currentHeight = $('.exactly.aller');
  }


  shapeDom = $('.shape');
  shapeDom.shape({
    duration: 400
  });


  var heightImg = $(".exactly.image").width() * 1.1;
  var widthImg = $(".exactly.image").width() - 15;


  $(".exactly.image img").css({
    width: widthImg,
    height: heightImg
  });


  $("#next_slide").click(() => shapeDom.shape('flip back'));
  $("#previous_slide").click(() => shapeDom.shape('flip over'));
}